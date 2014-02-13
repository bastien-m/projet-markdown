Reveal.initialize({
	controls: true,
	progress: true,
	history: false,
	center: true,
	slideNumber: true,
	touch: true,
	embedded: true,
	// Factor of the display size that should remain empty around the content
    margin: 0.1,
    // Bounds for smallest/largest possible scale to apply to content
    minScale: 0.2,
    maxScale: 0.8,
	theme: Reveal.getQueryHash().theme, // available themes are in /css/theme
	transition: Reveal.getQueryHash().transition || 'default', // default/cube/page/concave/zoom/linear/fade/none

	// Parallax scrolling
	// parallaxBackgroundImage: 'https://s3.amazonaws.com/hakim-static/reveal-js/reveal-parallax-1.jpg',
	// parallaxBackgroundSize: '2100px 900px',

	// Optional libraries used to extend on reveal.js
	dependencies: [
		{ src: '../node_modules/reveal-md/node_modules/reveal.js/lib/js/classList.js', condition: function() { return !document.body.classList; } },
		{ src: '../node_modules/reveal-md/node_modules/reveal.js/plugin/markdown/marked.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
		{ src: '../node_modules/reveal-md/node_modules/reveal.js/plugin/markdown/markdown.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
		{ src: '../node_modules/reveal-md/node_modules/reveal.js/plugin/highlight/highlight.js', async: true, callback: function() { hljs.initHighlightingOnLoad(); } },
		{ src: '../node_modules/reveal-md/node_modules/reveal.js/plugin/zoom-js/zoom.js', async: true, condition: function() { return !!document.body.classList; } },
		{ src: '../node_modules/reveal-md/node_modules/reveal.js/plugin/notes/notes.js', async: true, condition: function() { return !!document.body.classList; } },
		{ src: 'http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS_HTML', async: true }
	]
});