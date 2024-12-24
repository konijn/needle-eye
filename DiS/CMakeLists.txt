cmake_minimum_required(VERSION 3.10)
project(DiS)

set(CMAKE_CXX_STANDARD 14)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

find_package(SFML 2.5 REQUIRED COMPONENTS graphics window system)

add_executable(${PROJECT_NAME}-server server.cpp)
add_executable(${PROJECT_NAME}-client client.cpp)

target_link_libraries(${PROJECT_NAME}-client sfml-graphics sfml-window sfml-system)
