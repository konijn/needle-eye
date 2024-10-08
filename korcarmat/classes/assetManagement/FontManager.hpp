#ifndef FONT_MANAGER_HPP
#define FONT_MANAGER_HPP

#include <SFML/Graphics.hpp>
#include <unordered_map>
#include <string>
#include <memory>

class FontManager {
public:
    // Method to get the font, either from cache or by loading it
    std::shared_ptr<sf::Font> getFont(const std::string& fontFilePath);

private:
    // Cache that holds fonts mapped by their file paths
    std::unordered_map<std::string, std::shared_ptr<sf::Font>> fontCache;
};

#endif // FONT_MANAGER_HPP
