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

#include "classes/assetManagement/FontManager.hpp"

int QUIT = 0;

FontManager fontManager;

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

   while (window.isOpen()) {
      sf::Event event;
      while (window.pollEvent(event)) {
         if (event.type == sf::Event::Closed)
            window.close();
         if (event.type == sf::Event::MouseButtonPressed) {

         }

      }

      window.clear();
      window.draw(bg);
      window.draw(titleText);

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
