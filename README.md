# Kimeli Donald Portfolio

Personal portfolio site for Kimeli Kimutai Donald, a Geospatial Engineer (GIS, remote sensing and AI).

It is a single static page with no build step, framework or dependencies: plain HTML, CSS and JavaScript.

## Sections

Home, About, Skills, Experience, Projects and Contact, all on one page. The menu links scroll to each section.

## Project structure

```
index.html      All page content
remote.css      Base theme and utility classes (compiled Tailwind from the original design; do not edit)
style.css       Site components: hero, cards, skills layer panel, timeline, form
script.js       Mobile menu, active menu link, scroll reveals, skills panel, map coordinates, contact form
vercel.json     Hosting config for Vercel
Assets/
  donaldphoto.jpeg   Profile photo (hero)
  services/          "What I do" card images
  skills/            Skills panel map images
  projects/          Project card images
  *.png              Screenshots of the original design, kept for reference only (not used by the page)
```

## Run locally

Open `index.html` in a browser. To test it the way it runs when hosted, serve the folder instead:

```
python -m http.server 8000
```

Then go to http://localhost:8000.

## Editing content

- **Text:** edit `index.html`. Each section starts with a comment such as `<!-- Experience -->`.
- **Photo:** replace `Assets/donaldphoto.jpeg`, keeping the same file name.
- **Contact email:** change it in `index.html` and in `CONTACT_EMAIL` at the top of `script.js`.
- **Styles:** add or change rules in `style.css`. Leave `remote.css` as it is, because the whole page depends on it.

## Contact form

Messages are sent through [FormBold](https://formbold.com) to the endpoint in the form's `action` attribute in `index.html` (`https://formbold.com/s/9kZ1r`). FormBold then forwards them to the email address set up on that FormBold account.

`script.js` sends the form in the background, so the visitor stays on the page and sees a confirmation. If sending fails, they see an error with a direct email link instead. The fields sent are `name`, `email`, `subject` and `message`. If the subject is left blank, it is filled in as "Portfolio enquiry from (name)".

To use a different FormBold form, change only the `action` URL.

## Deploying to Vercel

1. Push the folder to a Git repository and import it in Vercel, or run `vercel` in this folder.
2. Set **Framework Preset** to "Other" and leave the build command empty.

`vercel.json` sends any unknown path back to `index.html`, and caches files in `Assets/` for 7 days. If you replace an image, give it a new file name so returning visitors see the change.

## Image credits

Images in `Assets/services`, `Assets/skills` and `Assets/projects` come from Wikimedia Commons. Each is credited with a link on the page itself. Keep those credits when changing or adding images, and check each file's licence on Commons before reusing it elsewhere.
