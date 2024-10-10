#ifndef TEXT_MANAGER_HPP
#define TEXT_MANAGER_HPP

#include <SFML/Graphics.hpp>
#include <vector>
#include <memory>

class TextManager {
public:
    // Add a new text instance to the manager
    void addText(const sf::Text& text);

    // Keep track of the last pressed one
    void setLastPressed(sf::Text* lastPressed);

    //get the last pressed one, this might get deleted
    sf::Text* getLastPressed();

    // Check if the passed text is the same as the last pressed text
    bool isLastPressed(const sf::Text* text) const;    

    // Check if any text collides with the given coordinates (x, y)
    sf::Text* collidesWith(float x, float y);

    // Draw all the text objects
    void draw(sf::RenderWindow& window);

private:
    std::vector<std::shared_ptr<sf::Text>> textList; // Store text instances
    sf::Text* lastPressedText = nullptr; // Pointer to the last pressed text

};

#endif // TEXT_MANAGER_HPP
