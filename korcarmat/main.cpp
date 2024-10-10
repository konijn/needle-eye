/* Main file for korcarmat, open world, card trading, 3-matching
   Copyright (C) 2024 Konijn 
   
    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.   
*/

/*
  Adding tags to sprites etc. https://en.sfml-dev.org/forums/index.php?topic=16048.0

*/
#include <string>
#include <iostream>

using namespace std;

#include "classes/assetManagement/FontManager.hpp"
#include "classes/widgets/TextManager.hpp"

int QUIT = 0;

FontManager fontManager;
TextManager textManager;

int IntroScreen()
{
   sf::RenderWindow window(sf::VideoMode(800, 600), "Lands of Llara");

   sf::Texture bgTexture;
   bgTexture.loadFromFile("./gfx/bg/jungle.jpeg");
   sf::Sprite bg;
   bg.setTexture(bgTexture);

   std::shared_ptr < sf::Font > titleFont = fontManager.getFont("./ttf/tuffy.ttf");

   sf::Text titleText("Lands of Llara", *titleFont, 50);
   sf::FloatRect bounds = titleText.getGlobalBounds();
   titleText.setOrigin(sf::Vector2f(bounds.width / 2, bounds.height / 2));
   sf::Vector2u windowSize = window.getSize();
   titleText.setPosition(sf::Vector2f(windowSize.x / 2, windowSize.y / 4));
   textManager.addText(titleText);

   while (window.isOpen()) {
      sf::Event event;
      while (window.pollEvent(event)) {
         if (event.type == sf::Event::Closed) {
            window.close();
         }
         // Check if a mouse button was pressed
         if (event.type == sf::Event::MouseButtonPressed) {
            // Check which button was pressed (left, right, etc.)
            if (event.mouseButton.button == sf::Mouse::Left) {
               // Access the x and y coordinates of the mouse click
               int x = event.mouseButton.x;
               int y = event.mouseButton.y;

               std::cout << "Left mouse button clicked at (" << x << ", " << y << ")\n";

               sf::Text * collidedText = textManager.collidesWith(x, y);
               if (collidedText) {
                  std::cout << "Clicked on: " << collidedText->getString().toAnsiString() << std::endl;
                  textManager.setLastPressed(collidedText);
               } else {
                  std::cout << "No text clicked!" << std::endl;
               }

            }
         }
         // Check for mouse button release (Mouse Up)
         if (event.type == sf::Event::MouseButtonReleased) {
            if (event.mouseButton.button == sf::Mouse::Left) {
               // Get the mouse position on release
               float mouseX = event.mouseButton.x;
               float mouseY = event.mouseButton.y;

               // Check for collision with any text object
               sf::Text * releasedText = textManager.collidesWith(mouseX, mouseY);
               if (releasedText && textManager.isLastPressed(releasedText)) {
                  std::cout << "Mouse up on the same text: " << releasedText->getString().toAnsiString() << std::endl;
               } else {
                  std::cout << "Mouse up on a different text or no text at all!" << std::endl;
               }
            }
         }

      }

      window.clear();
      window.draw(bg);
      textManager.draw(window);
      window.display();
   }

   return QUIT;
}

int main()
{
   int rc;
   rc = IntroScreen();
   if (!rc) {
      return 0;
   }
}
