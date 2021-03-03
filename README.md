# Voiceover Jr.

This is a Chrome extension that provides a basic screen-reader interface as the user visits webpages.

![A screenshot showing an passage, with an list item highlighted by this extension.](https://user-images.githubusercontent.com/1570168/109741623-46e04580-7b82-11eb-9461-aa867c71f2d4.png)


## About

I presented this software as an assignment for the course "Looking Forward" on March 2, 2021. This course at NYU "surveys assistive technologies for people with low vision and blindness, from historical, contemporary, and forward thinking perspectives."

All students in the class must present on a special topic of their choice. In class, we have been learning about accessibility technologies like VoiceOver, so for my presentation, I explored how difficult it would be to make similar software based on current Web fundamentals.

To showcase the ease of building this extension, ~~I live-coded the extension from scratch during my 15-minute presentation~~. Edit: Turns out that live coding takes longer than I thought, I was able to live-code only 1/3 of it. (I did one practice round earlier in the day, which took about 45 minutes. Many thanks to my friends Eshwar and Louisa for being a great test audience.)

My goals were:

- To take a brief dive into how software like VoiceOver works on a technical level and the challenges it deals with.
- To showcase how easy web technologies are to get started with, even if you've never used them before!
- To explore Chrome (or Firefox) extensions as a potential platform for creating accessibility tools.
- To make people feel empowered to make improvements to not only content, but tools, in with respect to accessibility.

This is primarily a technology demonstration and is not feature-complete, but I am happy to work on this more if anyone would like to use it.

## Features

- There is always a currently-selected element, which is highlighted. Initially, this element is the top-level `<html>` element.
- Press the arrow keys to navigate.
  - If we can't navigate in that direction, play an error sound.
  - Hold down shift to have the item read.
  - If the item is empty, say so.
- Hold down space to read the selected element.
- Click an element to select it.
- Hold down shift and move the cursor around to read the text under the cursor.

## How to install

1. Click Code > Download ZIP.
2. Unzip the download.
3. In Chrome, go to `chrome:extensions` in the address bar.
4. At the top-right of the page, there is a toggle labeled "Developer mode". Turn it on.
5. At top of the page, click "Load unpacked extension". Alternatively, you can drag the unzipped folder into the page.
6. That's it! Pages you open from now on will have the screen reader activated.
7. You can go to `chrome:extensions` in the future to disable or uninstall the extension.
