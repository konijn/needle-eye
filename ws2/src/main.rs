use std::fs;
//use std::cmp::Ordering;
use std::io::prelude::*;
use std::net::TcpStream;
use std::net::TcpListener;
use std::io::BufReader;

//Inspiration
//http://xion.io/post/code/rust-string-args.html
//https://users.rust-lang.org/t/reading-lines-with-tcpstream/34513/3

//mod log;

enum LogLevel {
  DEBUG=0,
  NORMAL=1,
  PROD=2
}

const LOG_LEVEL : LogLevel = LogLevel::DEBUG;

const GET:i8 = 1;
const OOPS:i8 = -1;


fn main() {
    let listener = TcpListener::bind("127.0.0.1:7878").unwrap();

    //Things we do to keep Rust happy ;)
    log("Server started".to_string(), LogLevel::PROD);

    for stream in listener.incoming() {
        handle_connection(stream.unwrap());
    }
}

fn validate_request_verb(verb: String)->i8 {
  if verb.eq("GET") {
    return GET;
  }
  return OOPS;
}

fn handle_connection(mut stream: TcpStream) {

    let mut line_count = 0;
    let mut reader = BufReader::new(stream.try_clone().unwrap());
    let mut request_verb:i8 = OOPS;

    loop {
        line_count = line_count + 1;
        let mut line = String::new();
        let line_size  = reader.read_line(&mut line).unwrap();
        if line_size > 0 {
            log(format!("{}:{}:{}", line_count, line_size, line), LogLevel::DEBUG);
            if line_count == 1 {
                let mut token_counter = 1;
                for token in line.split_whitespace(){
                    if token_counter == 1 {
                      request_verb = validate_request_verb(token.to_string());
                    }
                    token_counter = token_counter + 1;
                }
            } else { //line_count > 2
                if request_verb == GET && !line.contains(": ") {
                    spell_out(line);
                    //TODO: this only works for GET
                    //break;
     
                }
            }
        } else { //Count == 0
            log("Natural end of HTTP request reached".into(), LogLevel::NORMAL);
            break;
        }
        if line_count > 100 {
            log("HTTP request had more than 100 lines".into(), LogLevel::NORMAL);
            break;
        }
    }

    println!("We made it out!");

    let contents = fs::read_to_string("hello.html").unwrap();

    let response = format!(
        "HTTP/1.1 200 OK\r\nContent-Length: {}\r\n\r\n{}",
        contents.len(),
        contents
    );

    stream.write(response.as_bytes()).unwrap();
    stream.flush().unwrap();
}

fn log(message: String , maximum_log_level:LogLevel){
  if LOG_LEVEL as i8 <= maximum_log_level as i8 {
      if message.ends_with("\n") {
          print!("{}", message);
      } else {
          println!("{}", message);
      }
  }
}

#[allow(dead_code)]

fn spell_out(s: String){
    for c in s.chars(){
        println!("{}", c.escape_unicode());
    }
}