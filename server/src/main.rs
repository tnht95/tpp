use std::path::PathBuf;

use anyhow::{Context, Result};
use clap::Parser;
use server::{
    cli::{Cli, Cmd},
    config::{Config, LogFmt},
};
use tracing::trace;
use tracing_subscriber::{prelude::*, EnvFilter};

#[tokio::main]
async fn main() -> Result<()> {
    let cli = Cli::parse();

    let config =
        Config::from_file(PathBuf::from(&cli.config_path)).context("Could not read config file")?;

    // init logger
    match config.log_format {
        LogFmt::Json => {
            tracing_subscriber::registry()
                .with(tracing_subscriber::fmt::layer().json())
                .with(EnvFilter::from_default_env())
                .init();
        }
        LogFmt::Text => {
            tracing_subscriber::registry()
                .with(tracing_subscriber::fmt::layer().pretty())
                .with(EnvFilter::from_default_env())
                .init();
        }
    };

    trace!("config: {:?}", config);

    match cli.command {
        Cmd::Start => {
            server::init_roms(&config.rom_dir)
                .await
                .context("Failed to init roms")?;
            server::init(config)
                .await
                .context("Failed to init server")?
                .start()
                .await
                .context("Failed to start server")
        }
    }
}
