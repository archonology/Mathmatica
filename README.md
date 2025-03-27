# Mathmatica

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

An application for generating custom math quiz and personal, local high score tracking for grade school students.

**By [Reed Meher](https://www.meherdevs.com)**

### Visit Mathmatica:

[https://archonology.github.io/math-wiz/](https://archonology.github.io/math-wiz/)

## Table of Contents:

1. [About](#about)
2. [Usage](#usage)
3. [Contributing](#contributing)
4. [Support](#support)
5. [Gratitude](#gratitude)
6. [License Info](#license-info)

## About

My eldest daughter is in 4th grade. She told me she wanted to be the fastest in her class at solving multipication problems and wished she had a way she could practice beyond the worksheets she gets at school. For me, this sounded like the perfect coding challenge to spruce up on my web development essentials and a chance to inspire my kids with code. That is how **Mathmatica** came about.

I've been working in React and Angular for the past year, and it had been a long time since I was working with vanilla JavaScript, CSS, and HTML. I wanted to reacquaint myself with those foundational pillars to my craft, so I kept to those three for this application. I did decide to introduce some Bootstrap components for styling once I was further into the project, becauase I wanted to get something workable out for my daughter before the spring semester for her was up. I tend to get lost in the wonderland and infinite possiblities in CSS, which is fun for me, but slows down production!

Mathmatica grew to include not only multiplication, but the other grade school math operators, as well. My fourth grader wanted division, too, and once my 2nd grader heard what we were working on, they wanted addition and subtraction. That is how the project grew to include so much customization.

![Mathmatica screenshot](../assests/mathmatica.jpg)

## Usage

Usage is straightforward. From the home screen there is one button to set up the quiz. Once clicked, you will be prompted to select three radio button fields:

1. Time (1 min | 3 min | 6 min)
2. Difficulty ( easy | medium | hard)
3. Math Type (add | subtract | multiply | divide)

Once selected, you will get repeated math questions until the timer runs out. When you get a correct answer, it will appear in green to the right of the input field. When you get a wrong answer, the correct answer will appear in red to the left of the input field.

My daughter and I tweaked the difficulties for the various maths. At first easy for multiplication was two single digit integers chosen at random; medium was two double digit integers; hard was two three digit integers. We decided the curve of difficulty was too high for what we wanted with the quiz, so now only one of the numbers goes up in length and the second number stays a single digit. Now she felt the dificulty variety was spot on, but this made the adding and subtracting too easy, so I reverted those methods back to both numbers going up in length.

As for division, neither of my daughters is working on remainders, not in decimal form anyway, so I had the challenge of finding a way to make that quiz only offer answers that would return integers. Only integers will be the solutions to all three difficulty levels of the division. I set up a simlpe helper function that checks if the answer is an integer, and if not, it gets two new random numbers from the random number generating function until it finds two numbers that return integers. There may be an even more efficient way to do this, but I wanted to challenge myself to come up with a solution to that challenge without any help to start. I may refactor later if I find a better technique!

My daughter primarily use tablets, and my eldest pointed this out to me near the end of development. Using the onscreen keyboard was a real pain on the tablet, so I introduced a numeric pad in the quiz. You can use the on screen pad or the numbers on your keyboard, player's choice. I recommend if you use the keyboard, hit enter on your keyboard, too, rather than use your mouse to click the enter button on screen: you will be faster!

## Contributing

If you would like to contribute to this application, you may:

1. Create a fork of the repository.
2. Check the Issues tab in my repository to see if there is anything flagged to be completed or fixed.
3. Work your coding magic.
4. Push up your work when it works, and make a pull request. Please include a detailed note of what you added or changed and why.

If it all looks good, you can expect gratitude and a happy merging.

## Support

Please reach out if you hit any snags, have questions, or come up with some helpful feedback.

<reed@meherdevs.com>

[Check out more of my open-source on Github](https://github.com/Archonology)

[See my portfolio](https://www.meherdevs.com)

## Gratitude

Thank you to my three beautiful daughters for the guidance and inspiration on this. JR is a true software tester and is harsh but fair in her criticism. Her insights led to some of the best bits in Mathmatica.

## License Info

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

This project is covered under **MIT License**.

_A short, permissive software license. Basically, you can do whatever you want as long as you include the original copyright and license notice in any copy of the software/source. There are many variations of this license in use._
