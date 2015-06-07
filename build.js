#!/usr/bin/env node
/*
 * Builds the website
 *
 * First we parse the markdown in /articles
 * Build each matching /gallery
 * Insert each into /templates/article
 * Create index page
 * 
 */


var url = require("url"),
    path = require("path"),
    fs = require("fs"),
    cp = require('child_process'),
    mkdirp = require("mkdirp"),
    hb = require("handlebars"),
    md = require("markdown-it")("commonmark"),
    front = require("html-frontmatter"),
    $ = require("cheerio"),
    utf8 = {encoding: "utf8"},
    build_script = process.argv[1],
    cwd = path.dirname(build_script),
    build_dir = path.join(cwd, "/dist"),
    article_dir = path.join(cwd, "/articles"),
    articles = fs.readdirSync(article_dir),
    tpl = path.join(cwd, "/tpl"),
    tpl_article = fs.readFileSync(path.join(tpl, "article.hbs"), utf8),
    tpl_index = fs.readFileSync(path.join(tpl, "index.hbs"), utf8),
    article_template = hb.compile(tpl_article),
    index_template = hb.compile(tpl_index),
    index_out = path.join(build_dir, "index.html"),
    index_info = {
      title: "My static blog",
      description: "An amazing  blog I made",
      articles: []
    };

// make the build dir
mkdirp(build_dir);

// remove horrible files on macs
cp.execSync('find . -name ".DS_Store" -depth -exec rm {} \\;');

// assemble the articles
articles.forEach(function (article) {
  var article_file = path.join(article_dir, article), // filepath
      article_base = path.basename(article, ".md"), // filename
      // path to write new file to
      article_out = path.join(build_dir, article_base + ".html"),
      // read the file
      article_content = fs.readFileSync(article_file, utf8),
      // parse frontmatter
      article_info = front(article_content.toString()),
      // make html, removing any comments (frontmatter)
      article_html = md.render(article_content.replace(/<\!--((.|\n)*?)-->/g, "")),
      // dom of article
      $article = $.load(article_html),
      article_title = article_info.title,
      article_summary = $article("p, li").first().text(),
      gallery = article_info.gallery || [];

console.log(gallery);

  // if no title in frontmatter, use first H1
  if (!article_title) {
    article_title = $article("h1").first().text();
    $article("h1").first().remove(); // don't repeat
    article_html = $article.html();
  }

  // if still no title, stop and warn
  if (!article_title) {
    console.error("ERROR: No title for "+article_file);
    return;
  }

  // set info for template
  article_info.content = article_html;
  article_info.title = article_title;
  article_info.summary = article_summary;
  article_info.url = article_base + ".html";

  // gallery
  if (gallery) {
    article_info.gallery = gallery;
    article_info.thumb = gallery[0];
  }

  //  write new html file
  fs.writeFileSync(article_out, article_template(article_info), utf8);

  // add article to the list for the index
  index_info.articles.push(article_info);
});

// write the index
fs.writeFileSync(index_out, index_template(index_info), utf8);


