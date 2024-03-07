use std::path::PathBuf;

use anyhow::{Context, Result};
use clap::Parser;
use server::{
    cli::{Cli, Cmd},
    config::{Config, LogFmt},
};
use tracing::trace;
use tracing_subscriber::{prelude::*, EnvFilter};

// TODO
// test
// CI/CD
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
            init_roms().await;
            server::init(config)
                .await
                .context("Failed to init server")?
                .start()
                .await
                .context("Failed to start server")
        }
    }
}

async fn init_roms() {
    let mut dirs = tokio::fs::read_dir("./fixed_roms")
        .await
        .expect("Fixed roms to exist");
    while let Ok(Some(dir)) = dirs.next_entry().await {
        tokio::fs::copy(
            dir.path(),
            format!(
                "./roms/{}",
                dir.path()
                    .to_str()
                    .expect("Exist path")
                    .split('/')
                    .last()
                    .expect("Exist file")
            ),
        )
        .await
        .expect("Copy successfully");
    }
}
