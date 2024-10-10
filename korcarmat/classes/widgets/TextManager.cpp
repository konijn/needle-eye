#include "TextManager.hpp"

// Add a new text instance to the manager
void TextManager::addText(const sf::Text& text) {
    textList.push_back(std::make_shared<sf::Text>(text));
}

void TextManager::setLastPressed(sf::Text* lastPressed)
{
    lastPressedText = lastPressed;
}

sf::Text *TextManager::getLastPressed()
{
    return lastPressedText;
}

// Check if the passed text is the same as the last pressed text
bool TextManager::isLastPressed(const sf::Text* text) const {
    return text == lastPressedText;
}

// Check if any text collides with the given coordinates (x, y)
sf::Text* TextManager::collidesWith(float x, float y) {
    for (auto& text : textList) {
        // Get the global bounds of the text
        sf::FloatRect bounds = text->getGlobalBounds();
        
        // Check if the (x, y) coordinate is inside the bounds of this text
        if (bounds.contains(x, y)) {
            return text.get(); // Return the sf::Text instance
        }
    }
    return nullptr; // Return null if no collision
}

// Draw all the text objects
void TextManager::draw(sf::RenderWindow& window) {
    for (auto& text : textList) {
        window.draw(*text);
    }
}
