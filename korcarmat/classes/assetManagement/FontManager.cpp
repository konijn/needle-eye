#include "FontManager.hpp"
#include <stdexcept>

std::shared_ptr<sf::Font> FontManager::getFont(const std::string& fontFilePath) {
    // Check if the font is already cached
    auto it = fontCache.find(fontFilePath);
    if (it != fontCache.end()) {
        return it->second; // Return cached font
    }

    // Otherwise, load the font
    std::shared_ptr<sf::Font> font = std::make_shared<sf::Font>();
    if (!font->loadFromFile(fontFilePath)) {
        throw std::runtime_error("Failed to load font: " + fontFilePath);
    }

    // Cache the font and return it
    fontCache[fontFilePath] = font;
    return font;
}
