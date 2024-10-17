---
title: Tailwind CSS
transition: slide-left
theme: seriph
highlighter: shiki
layout: intro
mdc: true
fonts:
    sans: Robot
themeConfig:
  primary: '#1be2e5'
  
---
# Tailwind CSS
### Khai-Yiu Soh

<!-- So today's lightning talk will be about Tailwind, mainly going through an overview, some of the motivation behind it and how to use it. This talk isn't going to go through every type of utility, since if you know CSS it's pretty straightforward and there are too many. -->
---
class: text-center bg-white text-black
---
# Overview

<br/>
<br/>
<br/>
1. Introduction <br/>
2. History <br/>
3. Inspiration<br/>
4. Benefits / Pitfalls <br/>
5. Configuration <br/>
6. Tools <br/>
7. Demonstration <br/>

---
layout: image-right
image: images/intro.png
class: text-center bg-white text-black
---
# Introduction

<br/>
<li>Tailwind CSS is a utility-first CSS framework</li><br/>
<li>Provides pre-defined styles over custom CSS</li><br/>
<li>Promotes consistency, efficiency and scalability</li><br/>
<li>Used by many large companies</li><br/>
<li>Customisable</li>

<!-- Tailwind CSS is a utility-first CSS framework, meaning it provides thousands of low-level utility classes to the user for directly styling their HTML. So in traditional CSS, you'd define your custom classes and properties in many CSS files, but with Tailwind you just use its predefined classes. Its also very straightforward to use, making it efficient and ensuring consistency in large scale projects. For instance, websites like Netflix and ChatGPT were styled using Tailwind. And even though Tailwind is arleady designed to be highly customisable, you may have edge cases that need special handling, in that case it's also easy to append your own custom CSS -->

---
layout: image-right
image: images/adam.png
class: text-center bg-white text-black
---
# History

<br/>
<li>Created by Adam Wathan in 2017</li><br/>
<li>Motivated by unmaintainability of traditional CSS</li><br/>
<li>Tailwind v2.1 introduced JIT compiler, purge unused CSS</li><br/>
<li>Currently in v3.4.13, scans and generates necessary CSS</li><br/>
<li>In the future, v4.0 will release with Oxide (new engine)</li><br/>

<!-- Tailwind was created in 2017 by Adam Wathan, motivated by the unmaintainability of writing traditional CSS. With it's utility-first approach, it mostly removes the need for managing custom css and dealing with naming conventions which become difficult to maintain in a growing project. Like I mentioned, it provides utility classes which are composable to provide more granular control over an element's styling, rather than relying on large components or classes that are hard to modify. Now about some of the version changes, in version 2.1, a JIT compiler was introduced for reducing build times and the ability to purge unused CSS classes after the initial build for minification. Currently, we're on version 3.4.13 which removes the need for purging, because it only generates the necessary styling now. And supposedly very soon, version 4 will release with a new engine called Oxide. Essentially the result is significantly faster parsing and build times with a unified tool chain, so no need for postCSS or dependencies on other packages. -->

---
layout: center
class: text-center bg-white text-black
---
# Inspiration

<br/>
<li>Styles are applied by adding classes to elements</li><br/>
<li>In pure CSS, class names reflect the description of its appearance</li><br/>
```js
<div class='profile-card' />
```
<br/>
<li>Instead, use general classes that can be reusable across the UI</li><br/>
```js
<div class='card' />
```
<!-- Now about some of the inspiration behind creating Tailwind. So as we know, we can apply styles to HTML elements by adding classes, and these class names usually describe what the component or element is actually rendering. So for example, profile-card sounds like a very specific class that's not reusable in other parts of your project except for the profile page, and you may require card-looking components somewhere else. So to promote reusability, you could rename it to card, which is more generalised name -->

---
layout: center
class: text-center bg-white text-black
---
# Inspiration

<br/>
<li>Issue: Each use case of a general class may be slightly different</li>
<li>Solution: Extract non-common CSS properties into their own class</li>

<div class='flex justify-start text-left gap-10 mt-10'>
<div class='flex-1'>
```js
<div class='card card-rounded card-shadow'/>
```
</div>
<div class='flex-1'>
```css
.card-rounded {
  border-radius: 30px;
}
```
</div>
</div>

<br/>
<li>Notice how the extracted class only does one thing</li>
<li>Tailwind applies the concept of atomic CSS, creating small, single-purpose classes</li><br/>
```js
<div class='flex p-2 font-sans shadow-md rounded-xl' />
```
<!-- But now you run into the common issue where you need to use cards in multiple places but each time you might need to change the styling by 1 or 2 properties. So one place using a card might require a box-shadow, or another one needs a border radius and so on. So you could extract those properties out of the card class and create new classes for them. But then you notice in the css for the card-rounded class on the right, it's setting a border-radius and its the only thing that its doing. And the thing is, you could apply this class to any element that required a border radius, it really has nothing to do with cards specifically. So the class name should just omit card from it. And you can kinda see where this is going if you applied the same logic to every class you've written, you will end up with a bunch of atomic classes that perform one thing. And this is exactly what Tailwind provides with their utility classes. So in the last snippet you might notice that it's Tailwind syntax, and it's pretty much what your classes were to look like if they were simplified to deal with only one styling change. The functionality is the same, it's just that it's composed by a bunch of smaller utility classes. -->

---
layout: center
class: text-center bg-white text-black
---
# Pitfalls

<br/>
```js
<div class='flex p-2 font-sans shadow-md rounded-xl' />
```
<br/>
<li>Learn Tailwind syntax</li><br/>
<li>Bloats the HTML structure with class tags, affecting readability</li><br/>
<li>Hard to migrate to another CSS framework</li><br/>

<!-- So looking at that previous div element, there's already some clear disadvantages so let's go through them. First off, you would need to familiarise yourself with Tailwind syntax, but if you already have knowledge of CSS it's not a big deal as the utility classes in Tailwind are just wrappers around regular CSS, the docs are easy to navigate also. And another factor I'm sure we've all encountered is bloating the HTML structure with all the class tags which can affect readability. So this is the main criticism of the utility-first approach and it's not really avoidable, it's just simply the tradeoff by composing multiple atomic classes, however, I've heard its something you get used to with more experience. But you can imagine how out of control even that simple div example can get if we wanted to add more styles or responsive capabilities. With that in mind, if you wanted to migrate to another CSS framework, it'd also be difficult since you'd have to rewrite everything, since all your current CSS would be Tailwind specific -->

---
layout: text-left
class: text-center bg-white text-black
---
# Benefits

<br/>
<li>Simply add styles to class attributes</li><br/>
<li>Rapid prototyping, styling already provided</li><br/>
<li>Consistent and maintainable</li><br/>
<li>No overhead of additional CSS files</li><br/>
<li>Minified build size by only generating used classes</li><br/>

<!-- Although you need to learn the name of the utility classes in Tailwind, the method of applying styles is the same as in regular CSS, just simply add the class to the element's class attribute so there's no new functional logic. Since you already get predefined utilities, you also have the ability to prototype something really quick. And despite having guidelines and all styling rules you follow to try maintain traditional CSS, it's just one of those things that typically spiral out of control pretty quickly. Imagine working with multiple developers and someone makes an arbitrary change, now there's a custom class which you need to track down in an adjacent CSS file. Or you revisit the code years later and all the custom class names don't mean anything to you anymore. What Tailwind can provide is consistency by not having to come up with class names anymore or having to create one time use custom classes, even many years later Tailwind will use the same utility names for everything and if you and your team are proficient at Tailwind, then it becomes a more familiar and efficient way to apply styling. You're also only applying the necessary amount of styling since the utility classes are atomic and you're not gonna have to manage adjacent CSS files within your project anymore as well. And despite the Tailwind package itself being quite large from all the utilities it provides, the final build size is optimised by only generating used classes -->

---
layout: center
class: text-center bg-white text-black
---
# Configuration

<br/>
<li>Optional <strong>tailwind.config.js</strong> at the root to apply customisations</li>
<li>Template: <code class='text-[#1be2e5]'><strong>npx tailwindcss init</strong></code></li>
<br/>
<br/>

<div class="text-left">
```js 
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {},
  },
  plugins: [],
}
```
</div>

<!-- So by default, Tailwind will search for an optional configuration file at the root where you can apply any customisations. And here's just a basic template that's generated when you run npx tailwindcss init. One of the options you can configure is contents which specifies the path to all the files which contain Tailwind class names, this allows Tailwind to dynamically generate styles for the classes you use. The example here specifies to search for Tailwind class names in html and javascript files within the src directory, but if you were working on a React project, you'd include jsx and even tsx as well. -->
---
layout: center
class: text-center bg-white text-black
---
# Generating classes

<br/>
<li>Scans all files specified in <code class='text-[#1be2e5]'><strong>content</strong></code> configuration for Tailwind classes</li>
<li>Not limited to <strong>class</strong> attribute</li><br/>

<div class="text-left">
```js
<p class="py-2 text-gray-600"
  Hello everyone
/> 

// p, class, py-2, text-gray-600, Hello, everyone
```
</div>
<br/>
<div class="text-left">
```js
const element = document.getElementById('p')
element.classList.toggle('hidden')
```
</div>

<!-- So like I said, Tailwind needs to dynamically generate all the corresponding CSS for the styles your project uses, and it does it through a very simple scan on all the files specified in the content property config. It will try extract all strings that could potentially be a Tailwind class name. In the example if you look at the line comment, that's the list of strings that Tailwind identifies and it will generate styles for the Tailwind classes. The reason why it's not just searching for names in the class attribute, is because you can potentially toggle classes in JavaScript like in the example where the element is being toggled to hidden, which is also a class. -->
---
layout: center
class: text-center bg-white text-black
---
# Dynamic class names

<br/>
<li>Tailwind only scans the files, it does not parse or execute</li>
<li>Full class name must exist, it does not resolve partially concatenated strings</li><br/>

<div class='text-left'>
```js
// Wrong
<div class="text-{{ error ? 'red' : 'green' }}-600"></div>

// Correct
<div class="{{ error ? 'text-red-600' : 'text-green-600' }}"></div>
```
</div>
<br/>
<div class='text-left'>
```js
<p>
  It will find the class text-red-600 even in the content section.
</p>
```
</div>

<!-- So more on generating class names, you may have come across the issue where Tailwind is not conditionally applying styles to elements, and that's probably because the styles for the class weren't generated in the style sheet initially. So in the first div element, when Tailwind scans the file it doesn't parse or execute code, meaning it won't resolve that partial string to text-red-600 or text-green-600 because it quite literally does not exist in the file. Whereas in the second div element, Tailwind will be able to find those Tailwind classes and generate those styles. In fact, as long the class name exists as a complete string anywhere in the source file, it will be generated no matter where it's defined which is why I suppose it's a very straightforward approach. So you can see text-red-600 exists in the paragraphs contents but it's not used in the context of applying styling, but it will still be generated in the style sheet. -->
---
layout: center
class: text-center bg-white text-black
---
# Blocking class names

<br/>
<li><code class='text-[#1be2e5]'><strong>blocklist</strong></code> configuration to ignore specific classes in your content</li>

<br/>
<div class='text-left'>
```js
<p>
  Do you want a container?
</p>
<p>
  I might collapse from exhaustion.
</p>
```
</div>
<br/>
<div class='text-left'>
```js
module.exports = {
  content: ["./src/**/*.{html,js}"],
  blocklist: ['container', 'collapse']
}
```
</div>

<!-- Now, you probably won't use text-red-600 in a regular sentence that you will display to the user. But there are some words that you might use which are also Tailwind class names, such as container or collapse. A small optimisation you can do if you're not using them, is to add it to the blocklist property in your configuration which prevents Tailwind from generating the styles for it. -->
---
layout: center
class: text-center bg-white text-black
---
# Prefix

<br/>
<li><code class='text-[#1be2e5]'><strong>prefix</strong></code>: Add a custom prefix to Tailwind's generated utility classes</li>
<li>ONLY added to Tailwind generated classes</li>
<li>Useful for separating CSS systems and custom CSS from Tailwind</li>
<br/>
<br/>

<div class='flex justify-start text-left gap-10'>
<div class='flex-1 w-[300px]'>
```js
// tailwind.config.js

module.exports = {
  prefix: 'tw-',
  ...
}
```
</div>
<div class='flex-1 w-[400px]'>
```js
// index.html

<h1 
  class="tw-text-blue-500 hover:tw-text-red-500"
>
</h1>
```
</div>
</div>

<!-- So the prefix option as it sounds, just adds a prefix to only Tailwind generated utility classes. So this can be useful for avoiding naming conflicts between different CSS systems or your custom CSS but just also easier to differentiate Tailwind classes from others in general. -->

---
layout: center
class: text-center bg-white text-black
---
# Theme option

<br/>
<br/>
<li><code class='text-[#1be2e5]'><strong>themes</strong></code>: Extend / configure overridable values for predefined utility classes</li>
<br/>
<br/>

<div class='flex justify-start text-left gap-10'>
<div class='flex-1'>
```js
theme: {
  screens: {
    'sm': '700px', // Default: 640px
  },
  colors: {
    white: '#fff',
    gray: {
      100: '#f7fafc',
      // ...
      900: '#1a202c'
    }
  }
}
```
</div>
<div class='flex-1'>
```js
theme: {
  extend: {
    colors: {
      'custom-1': '#ADD8E6',
      'custom-2': '#A2A8D3',
      'custom-3': '#38598B',
      'custom-4': '#113F67'
    }
  }
}
```
</div>
</div>

<!-- In the themes section, you can define new values for properties like fonts, screen size breakpoints, colours, spacing and so on which will override the default values. And if you specify an extend property in the themes object, you can extend the values even more. So for example everyone has their own colour palette for connect4, you could define it here for easier reference rather than trying to manually insert an arbitrary hex code everytime. -->

---
layout: center
class: text-center bg-white text-black
---
# Plugin option

<br/>
<li>Register new styles using JavaScript</li>
<li><strong>plugin</strong> provides helper functions to <strong>callbackFn</strong></li>
<br/>
<br/>

<div class='text-left'>
```js {*}{lines:true,startLine:1}
// tailwind.config.js

import plugin from 'tailwindcss/plugin'

module.exports = {
  plugins: [
    plugin((objectWithUtils) => {})
  ]
  ...
}
```
</div>

<!-- You can also extend Tailwind by providing your own plugins, which are just functions similar to what we've seen in Babel previously. So you need to import the plugin function from the tailwindcss/plugin package, and it will take a callback function which is your plugin. Your callback takes in 1 parameter which is an object containing helper methods which will help register new custom styles. -->

---
layout: center
class: text-center bg-white text-black
---
# Static utilities example

<br/>
<div class='text-left'>

```js {*}{lines:true,startLine:1}
plugins: [
  plugin(function ({ addUtilities }) {
    const newUtilities = {
      '.text-shadow': {
          textShadow: '2px 2px rgba(0, 0, 0, 0.5)',
        },
      '.text-shadow-lg': {
          textShadow: '4px 4px rgba(0, 0, 0, 0.7)',
      },
    };
    
    addUtilities(newUtilities);
  })
]
```
</div>

<!-- So here's an example of creating the static utilities text-shadow and text-shadow-lg. Tailwind expects CSS rules to be written as JavaScript objects. So the key is the newly generated class name and the object contains actual CSS properties. I mentioned your plugin function takes in an object, here the helper method addUtilities is destructured and used as an example to add new styles to Tailwind's utilities layer. And like any other default utilities, custom CSS is only generated if it's being used in a project. -->
---
layout: center
class: text-center bg-white text-black
---
# Dynamic utilities example

<br/>
<div class="flex w-full space-x-4">
  <div><strong>margin-1</strong>: 0.25 rem</div>
  <div><strong>margin-2</strong>: 0.5 rem</div>
  <div><strong>margin-3</strong>: 0.75 rem</div>
  <div><strong>margin-4</strong>: 1 rem</div>
</div>


<div class='flex justify-start text-left gap-10 mt-10'>
<div class='flex-1'>

```js
theme: {
  extend: {
    spacing: {
      '1': '0.25rem',
      '2': '0.5rem',
      '3': '0.75rem', 
      '4': '1rem', 
    },
  },
}
```
</div>
<div class='flex-1'>
```js {*}{lines:true,startLine:1}
plugins: [
  plugin(function({ matchUtilities, theme }) {
    matchUtilities(
      {
        'margin': (value) => ({
          margin: value,
        }),
      },
      {
        values: theme('spacing'),
      }
    )
  }),
]
```
</div>
</div>

<!-- And here's an example of how you can register dynamic utilities using the helper methods matchUtilities and theme. The theme function allows you to access values defined in the theme configuration. And match utilities takes in an object with the classes you want to generate and a mapping function. In this example, we want to generate multiple margin classes and the mapping function is applied over themes spacing object to obtain the full margin class name, and its corresponding value. So it will create margin-1 with a value of 0.25 rem, margin-2 will be 0.5rem, and so on. In the case of properties not being assigned valid values, like if it mapped over colours instead and margin were then assigned a colour, Tailwind will just not generate the utility classes and ignore it. -->
---
layout: center
class: text-left bg-white text-black
---
# Directives

<br/>
<li><code class='text-[#1be2e5]'><strong>base</strong></code>: Resets styles to ensure consistency between browser engines</li>
<li><code class='text-[#1be2e5]'><strong>components</strong></code>: Inject Tailwind component classes or components registered by plugins</li>
<li><code class='text-[#1be2e5]'><strong>utilities</strong></code>: Adds utility classes for styling your HTML</li>
<li><code class='text-[#1be2e5]'><strong>layer</strong></code>: Tells Tailwind which "layer" a set of custom styles belong to (base, components, utilities)</li>
<li><code class='text-[#1be2e5]'><strong>apply</strong></code>: Allows you to inline Tailwind utility classes into custom CSS</li><br/>

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
  .custom-btn-blue {
    @apply bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded;
  }
}
```

<!-- So in your project, you'd have a main css file which contains special directives that Tailwind uses to include the different layers of styles, allowing you to include the base styles, components and utilities that it provides. So generally, directives are instructions typically guiding how a compiler is handling certain sections of your code. In Tailwind's case, it uses PostCSS which is a CSS parser and its going to process these directives and basically inject the boilerplate CSS. So the goal of the base directive is to import the base styles that are minimal but help normalise the experience across different browsers. You can also inject any components you or Tailwind define through the component directive. And the bulk of it comes from utilities, which provides all of Tailwind's utility classes that you use. And if you wanted to inject your own components or styles, using the layer directive will inject them in whichever layer you specify, could be base, components or utilities and it will essentially treat your custom classes as if it was a Tailwind class, meaning you also get the benefit of Tailwind omitting any unused CSS in the final build. And if you don't use the layer directive, it will just be treated as a regular CSS rule but you will lose the benefit mentioned before, and if there are any naming conflicts with any of Tailwinds classes then that could lead to unpredictable behaviour since duplicate classes in the same CSS file can override each other's properties. And the last directive is apply which allows you to bundle Tailwind utilities to create your own classes. It's not recommended to overly use this directive because the point of Tailwind is that all the styles are atomic, and you only apply only the styles that are necessary. But sometimes as your project grows and you notice a repetitive pattern where all the buttons are the same styling for example, then it's fine to create a class like below which consists of multiple properties -->
---
layout: center
class: text-center bg-white text-black
---
# Generate styles

<br/>
<li>Input file contains directives and custom CSS</li>
<li>Output file contains generated CSS styles used by your project</li><br/>

<code class='text-[#1be2e5]'><strong>npx tailwindcss -i [input.css] -o [output.css]</strong></code>

<!-- So to build your final stylesheet with Tailwind, you'd use your main CSS file as the input where you added your directives and custom CSS. And if you run that command it will build your stylesheet containing all the utilities your project needs in the output CSS file. It should automatically find your tailwind.config.js file at the root, but if it's named something else then it needs to be specified in the command. -->
---
layout: image-right
image: images/vscode_extension.png
class: text-center bg-white text-black
---
# VSCode extension

<br/>
<br/>
<li><code class='text-[#1be2e5]'><strong>Tailwind CSS IntelliSense</strong></code></li><br/>
<li>Autocomplete, syntax highlighting, linting</li>

<!-- Now I will just go into some useful tools you can use along Tailwind for a better experience, so Tailwind CSS IntelliSense is an official vscode extension by the developers which helps with autocompletion, syntax highlighting, linting so if you're not fully sure of some syntax then it can save you some trouble from switching back and forth between the docs. -->
---
layout: center
class: text-center bg-white text-black
---
# Prettier plugin

<br/>
<li><code class='text-[#1be2e5]'><strong>npm install prettier prettier-plugin-tailwindcss</strong></code></li><br/>
<li>Sorts class tags into related groups</li><br/>

<div class='text-left'>
```json
// .prettierrc

{
  "plugins": ["prettier-plugin-tailwindcss"]
}
```
</div>

<!-- Another useful feature is a plugin called prettier-plugin-tailwindcss, which you can install through NPM. As we know, the amount of code appearing just from using the class utilities can make it hard to read the HTML structure, so at least this plugin will somehow mitigate that slightly by sorting the class tags into related styling groups. So all the layout styles will be together, same with spacing or sizing, etc. So this can help you envision the styles you've applied more clearly and if you wanted to revisit the styles of an old element, you can just append the new utility anywhere and it will sort itself out. -->

---
layout: center
class: text-center bg-white text-black
---
# Prettier example

<br/>
<div class='mx-auto text-left'>
```js
<button class="text-white px-4 sm:px-8 py-2 
               sm:py-3 bg-sky-700 hover:bg-sky-800"
>
</button>
```
</div>
<br/>
<div class='mx-auto text-left'>
```js
<button class="bg-sky-700 px-4 py-2 text-white 
               hover:bg-sky-800 sm:px-8 sm:py-3"
>
</button>
```
</div>

<!-- So in the first example, the classes are just randomly added but if you save your code with the plugin applied, it will re-order the class tags based off related groupings. So the padding is together for example, and all the responsive utilities are at the end. -->
---
layout: center
class: text-center bg-white text-black
---
# Thanks for listening!