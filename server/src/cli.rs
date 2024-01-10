use clap::{Parser, Subcommand};

#[derive(Parser)]
#[command(author, version, about, long_about = None)]
#[command(propagate_version = true)]
pub struct Cli {
    /// config path location
    #[arg(short = 'c', long, default_value_t = format!("{}/.{}/config.toml", env!("HOME"), env!("CARGO_PKG_NAME")))]
    pub config: String,

    #[command(subcommand)]
    pub command: Cmd,
}

#[derive(Subcommand)]
pub enum Cmd {
    /// Start a server
    Start,
}
