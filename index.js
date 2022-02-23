// Imports
import fs from "fs";
import path from "path";

import express from "express";
import ejs from 'ejs';

import markdownIt from 'markdown-it';

import sub from 'markdown-it-sub';
import sup from 'markdown-it-sup';
import footnote from 'markdown-it-footnote';
import emoji from 'markdown-it-emoji';
import highlight from 'highlight.js';
var hljs = highlight;


// Markdown
var md = markdownIt({
    html: true,
    linkify: true,
    typographer: true,
    highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return '<pre class="hljs"><code>' +
                    hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
                    '</code></pre>';
            } catch (__) {}
        }
    
        return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
    }
})
    .use(emoji)
    .use(sub)
    .use(sup)
    .use(footnote)


md.renderer.rules.emoji = function(token, idx) {
    return '<span class="emoji">' + token[idx].content + '</span>';
};


// Express App
const app = express();
app.listen(3000, () => {
    console.log("Server listening on http://localhost:3000 ...");
});

// Middleware
app.set('public', path.join(process.cwd(), '/public'));
app.set('views', path.join(process.cwd(), '/public'));


// Motor de plantillas EJS
app.set('view engine', 'ejs');
app.use(express.static(path.join(process.cwd(), "/public")));


// Routes
app.get("*", (req, res) => {
    var mdFile = fs.readFileSync(process.cwd() + '/README.md').toString();
    res.render('index', { html: md.render(mdFile), md: mdFile })
});