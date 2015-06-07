# A Simple Static Site Generator Starter-kit

A small set of useful scripts for creating a static site generator, using [Markdown](https://help.github.com/articles/markdown-basics/) for the content, [Handlebars](http://handlebarsjs.com/) for templates, and [rsync](https://wiki.archlinux.org/index.php/Rsync) to publish. Intended to be extensively extended to suit your needs, this starter-kit aims only to provide the basics needed to begin rendering your own static web site.

`build.js` creates a simple blog-like site of articles from the markdown files in `articles/` using handlebars template `tpl/article.hbs`, and an index page listing the articles using the template `tpl/index.hbs`.

`dev.js` runs a development server so you can preview and polish the site. HTML files are served from `dist/`, and all other file types are served from `assets/`. Make sure you run `build.js` first so you have pages to serve!

Use `publish.sh` to push the site to your server once you've edited the file to include your server info.

Don't forget to run `$ npm install` after you've cloned to install the dependencies. You may need to add execute permissions for some files, if you do just run `$ chmod u+x build.js dev.js publish.sh`.