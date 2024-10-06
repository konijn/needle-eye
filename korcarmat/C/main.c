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

#include <SFML/Audio.h>
#include <SFML/Graphics.h>

#include <stdlib.h>
#include <stdio.h>

sfRenderWindow *window;
sfText *titleText;
sfFont *font;

void showTitle()
{
   const char *title = "Lands of LLara";

   sfFloatRect bounds;
   sfVector2f center;
   sfVector2f newLocation;
   sfVector2u windowSize;

   //We ask window-size again to reduce globals
   windowSize = sfRenderWindow_getSize(window);
   //Create control, set properties
   titleText = sfText_create();
   sfText_setString(titleText, title);
   sfText_setFont(titleText, font);
   sfText_setCharacterSize(titleText, 50);
   //Get bounds to set the center as the center, instead of 0,0 default
   //printf("Located @ (%f,%f) with size (w:%f,h:%f)\n", bounds.left, bounds.top, bounds.width, bounds.height);
   bounds = sfText_getGlobalBounds(titleText);
   center.x = bounds.width / 2;
   center.y = bounds.height / 2;
   sfText_setOrigin(titleText, center);
   //New location is center window, 1/3 from the top
   newLocation.x = windowSize.x / 2;
   newLocation.y = windowSize.y / 3;
   sfText_setPosition(titleText, newLocation);
}

int main()
{
   sfVideoMode mode = { 800, 600, 32 };
   sfTexture *texture;
   sfSprite *sprite;

   sfMusic *music;
   sfEvent event;

   /* Create the main window */
   window = sfRenderWindow_create(mode, "Lands of LLara", sfResize | sfClose, NULL);
   if (!window)
      goto oops;

   /* Load the background as a texture, to be displayed as a sprite */
   texture = sfTexture_createFromFile("./gfx/bg/jungle.jpeg", NULL);
   if (!texture)
      return EXIT_FAILURE;
   sprite = sfSprite_create();
   sfSprite_setTexture(sprite, texture, sfTrue);

   /* Create a graphical text to display */
   font = sfFont_createFromFile("./ttf/tuffy.ttf");
   if (!font)
      goto oops;

   showTitle();

   /* Load a music to play */
   music = sfMusic_createFromFile("./ogg/doodle_pop.ogg");
   if (!music)
      goto oops;
   /* Play the music */
   sfMusic_play(music);
   /* Start the game loop */
   while (sfRenderWindow_isOpen(window)) {
      /* Process events */
      while (sfRenderWindow_pollEvent(window, &event)) {
         /* Close window : exit */
         if (event.type == sfEvtClosed)
            sfRenderWindow_close(window);
      }
      /* Clear the screen */
      sfRenderWindow_clear(window, sfBlack);
      /* Draw the sprite */
      sfRenderWindow_drawSprite(window, sprite, NULL);
      /* Draw the text */
      sfRenderWindow_drawText(window, titleText, NULL);
      /* Update the window */
      sfRenderWindow_display(window);
   }
   /* Cleanup resources */
   sfMusic_destroy(music);
   sfText_destroy(titleText);
   sfFont_destroy(font);
   sfSprite_destroy(sprite);
   sfTexture_destroy(texture);
   sfRenderWindow_destroy(window);
   return EXIT_SUCCESS;

 oops:
   return EXIT_FAILURE;
}
