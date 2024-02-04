use std::{
    fs::{create_dir_all, read_to_string, File},
    io::Write,
    path::PathBuf,
};

use anyhow::{bail, Result};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct Config {
    pub log_format: LogFmt,
    pub server: Server,
    pub github_app: GithubApp,
    pub auth: Auth,
    pub site_url: String,
    pub rom_dir: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub enum LogFmt {
    Json,
    Text,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Server {
    pub http_port: u16,
    pub pg_url: String,
    pub pg_max_pool: u32,
    pub cors_max_age: u64, // seconds
}

#[derive(Serialize, Deserialize, Debug, Default)]
pub struct GithubApp {
    pub client_id: String,
    pub client_secret: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Auth {
    pub jwt: Jwt,
    pub redirect_url: String,
    pub admin_id: i64,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Jwt {
    pub secret: String,
    pub expire_in: u64, // seconds
}

impl Default for Config {
    fn default() -> Self {
        Self {
            log_format: LogFmt::Text,
            server: Server {
                http_port: 8080,
                pg_url: "postgres://service:password@localhost:5432/book?sslmode=disable".into(),
                pg_max_pool: 50,
                cors_max_age: 3600,
            },
            github_app: GithubApp::default(),
            auth: Auth {
                jwt: Jwt {
                    secret: "".into(),
                    expire_in: 3600,
                },
                redirect_url: "http://localhost:3000".into(),
                admin_id: 40195902,
            },
            site_url: "http://localhost:3000".into(),
            rom_dir: format!("{}/roms", env!("PWD")),
        }
    }
}

impl Config {
    pub fn from_file(file: PathBuf) -> Result<Self> {
        if !file.exists() {
            if let Some(parent_dir) = file.parent() {
                create_dir_all(parent_dir)?;
                let config = Config::default();
                let mut new_file = File::create(file)?;
                let toml = toml::to_string(&config)?;
                new_file.write_all(toml.as_bytes())?;
                return Ok(config);
            }
            bail!("parent dir not found");
        }

        // FIXME: init /roms folder

        let toml = read_to_string(file)?;
        Ok(toml::from_str(&toml)?)
    }
}
