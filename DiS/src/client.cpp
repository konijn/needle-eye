#include <SFML/Network.hpp>
#include <SFML/Graphics.hpp>
#include <iostream>

sf::Text createLabel(sf::Font& font) {
    sf::Text label;
    label.setFont(font);
    label.setString("DiS");
    label.setCharacterSize(48);
    label.setFillColor(sf::Color::Yellow);
    return label;
}

void updateLabelPosition(sf::RenderWindow& window, sf::Text& label) {
    sf::FloatRect labelSize = label.getLocalBounds();
    sf::Vector2u windowSize = window.getSize();

    label.setOrigin(labelSize.left + labelSize.width/2.0f,
                    labelSize.top  + labelSize.height/2.0f);

    label.setPosition(windowSize.x / 2, 50);
}

int main() {
    // Create the window
    sf::RenderWindow window(sf::VideoMode(800, 600), "DiS");

    // Load the font
    sf::Font font;
    font.loadFromFile("./res/fnt/DejaVuSans-BoldOblique.ttf");

    // Create the label
    sf::Text label = createLabel(font);
    updateLabelPosition(window, label);

    // Run the program as long as the window is open
    while (window.isOpen()) {
        // Check all the window's events that were triggered since the last iteration of the loop
        sf::Event event;
        while (window.pollEvent(event)) {
            // "close requested" event: we close the window
            if (event.type == sf::Event::Closed)
                window.close();

            // "resized" event: destroy the label and rebuild it
            if (event.type == sf::Event::Resized) {

                // update the view to the new size of the window
                sf::FloatRect visibleArea(0, 0, event.size.width, event.size.height);
                window.setView(sf::View(visibleArea));

                label = createLabel(font);
                updateLabelPosition(window, label);
                sf::Vector2u windowSize = window.getSize();
            }
        }

        // Clear screen
        window.clear();

        // Draw the label
        window.draw(label);

        // Update the window
        window.display();
    }

    return 0;
}