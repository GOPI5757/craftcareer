/* Reviewed CraftCareer help content. Keep control names aligned with app.js. */
(function(G){
const topics=[
  {
    "id": "start",
    "title": "Build your first page",
    "tags": "start beginner beginning new create website portfolio blank empty layout",
    "intro": "Start with sections, then split their space and add components.",
    "steps": [
      "Choose + Section in the hierarchy or + Add section above the canvas. Give it a unique name.",
      "Choose Fit for an opening screen, Flexible for a chosen height, Infinite for multiple content subsections, or Projects for cards and categories.",
      "Hover a cell and choose Split. Choose rows or columns, 2–4 cells, and adjust the percentage slider.",
      "Drag components from the bottom shelf into the cells. Select a component to edit it in the inspector.",
      "Test Browse and the device previews, then use Workspace → Export website to save a portable ZIP."
    ],
    "action": "sections",
    "related": [
      "split",
      "components",
      "export"
    ]
  },
  {
    "id": "sections",
    "title": "Choose and manage sections",
    "tags": "section fit flexible infinite full screen height delete remove reorder rename profile page",
    "intro": "A section defines a major part of the page. Its type controls how its content is laid out.",
    "steps": [
      "Use the section chooser above the canvas or click its name in the hierarchy, then Section settings.",
      "Fit fills the available viewport; large content may need more space. Flexible exposes Height · rem. Infinite contains multiple subsections.",
      "Use + Add section to create another section. Use × Remove in the section strip and confirm to remove one.",
      "Removing a section removes its exported configuration and moves its assets to protected Archive folders. Export a backup before major changes."
    ],
    "action": "section-settings",
    "related": [
      "subsections",
      "background",
      "responsive"
    ]
  },
  {
    "id": "split",
    "title": "Split or rearrange cells",
    "tags": "split cells grid rows columns horizontal vertical direction percentages ratio nested partition intersection divider",
    "intro": "Columns sit side by side; rows sit one above another.",
    "steps": [
      "Select or hover the cell and choose Split. Choose 2–4 cells and select Rows or Columns; the diagram shows the result.",
      "Drag the slider boundaries to distribute space. The percentages automatically total 100.",
      "To change an existing split, hover any child cell and choose Edit split, or select the parent grid in the hierarchy.",
      "Drag an intersection in the canvas to change neighbouring cell sizes. Splits are limited to three nested levels; use a new subsection for more content.",
      "Reducing a split’s cell count removes the trailing cells after confirmation. Undo can restore them."
    ],
    "action": "inspector",
    "related": [
      "sections",
      "alignment",
      "blend"
    ]
  },
  {
    "id": "components",
    "title": "Add, replace or remove a component",
    "tags": "component widget element drag drop replace remove delete cross empty cell",
    "intro": "Each unsplit cell holds one component. A list counts as one component.",
    "steps": [
      "Drag a component from the bottom shelf into a leaf cell, or select the cell and click a shelf component.",
      "Dropping another component into an occupied leaf cell replaces it. Undo restores the previous component.",
      "Use the selected cell’s Remove component control or the inspector’s Remove component button, then confirm.",
      "If a cell is split, choose one of its child cells before placing content."
    ],
    "action": "components",
    "related": [
      "move",
      "lists",
      "resize"
    ]
  },
  {
    "id": "move",
    "title": "Move or duplicate between cells",
    "tags": "move swap copy duplicate drag right mouse left mouse component cell",
    "intro": "Left-drag moves or swaps components. Right-drag copies a component.",
    "steps": [
      "In Edit mode, drag the component with the left mouse button to another leaf cell. Occupied cells swap their components.",
      "To copy instead, start and finish the drag with the right mouse button. Dropping the copy on occupied content replaces that destination.",
      "A right click without dragging retains the browser context menu. Use Undo if you copy or move to the wrong cell.",
      "To duplicate an item inside a list, select that item and press Ctrl+D or Cmd+D."
    ],
    "action": "inspector",
    "related": [
      "lists",
      "shortcuts"
    ]
  },
  {
    "id": "resize",
    "title": "Resize without stretching",
    "tags": "resize scale size width height aspect ratio proportions shift handles markers edges",
    "intro": "Select a component in Edit mode to reveal its resize handles.",
    "steps": [
      "Drag a corner or edge handle. Hold Shift while dragging to keep the starting proportions.",
      "Use Frame size in the inspector for precise component dimensions. Buttons also have their own Fit to content, Width and Height controls.",
      "Flexible sections and content subsections can be resized using their canvas sizing controls or height fields.",
      "The cell limits available space. If the component cannot grow further, resize its cell or section instead."
    ],
    "action": "inspector",
    "related": [
      "buttons",
      "subsections",
      "alignment"
    ]
  },
  {
    "id": "alignment",
    "title": "Position content inside a cell",
    "tags": "align alignment left right center centre top bottom middle position padding margin spacing",
    "intro": "Cell positioning and text alignment are separate settings.",
    "steps": [
      "Select the component, expand Cell layout, and set Position to a left/center/right and top/middle/bottom position.",
      "Use Padding for space inside the cell, Outer margin for space outside it, and Space between cells on the parent grid.",
      "For text inside its own frame, use Appearance → Alignment and Vertical alignment.",
      "Arrow keys step through cell alignments when a component is selected and you are not typing in a field."
    ],
    "action": "inspector",
    "related": [
      "text",
      "split",
      "resize"
    ]
  },
  {
    "id": "text",
    "title": "Edit and style text",
    "tags": "text words title heading paragraph bold italic underline font typography line height vertical text",
    "intro": "Use a Text component for editable headings and paragraphs.",
    "steps": [
      "Double-click text in the canvas to type, or select it and edit Text in the inspector.",
      "Set Text role to paragraph, page title, section heading or small heading.",
      "Appearance contains Font, Text size, Text color, Weight, Style, Underline, Alignment, Vertical alignment, Line height and Letter spacing.",
      "Button labels, list items and other component titles have their own text fields and applicable appearance controls."
    ],
    "action": "inspector",
    "related": [
      "alignment",
      "lists",
      "background"
    ]
  },
  {
    "id": "buttons",
    "title": "Set button size, icon and label",
    "tags": "button fit content size width height icon only no text label",
    "intro": "Buttons can fit their content or use custom dimensions without scaling their text.",
    "steps": [
      "Select the button and open Button dimensions & icon. Enable Fit to content for automatic size.",
      "Disable Fit to content to set Width · rem and Height · rem. The contents still need enough room, and the cell limits the available space.",
      "Choose an icon from the icon library or an Icon image. Clear the Label for an icon-only button and give it an Accessible description.",
      "Configure On click separately to choose the destination or action."
    ],
    "action": "inspector",
    "related": [
      "actions",
      "button-states",
      "icons"
    ]
  },
  {
    "id": "button-states",
    "title": "Change hover and pressed colors",
    "tags": "button hover click pressed colour color fill transparent no fill mouse over",
    "intro": "Hover and pressed states are separate from the button’s normal appearance.",
    "steps": [
      "Select a button and expand Hover appearance or Click / pressed appearance.",
      "Change the Text color and Background color fields. Disable the corresponding fill toggle for no fill.",
      "For button lists, shared states apply unless a particular item enables Individual style and overrides them.",
      "Test the result in Browse mode."
    ],
    "action": "inspector",
    "related": [
      "buttons",
      "lists",
      "preview"
    ]
  },
  {
    "id": "actions",
    "title": "Link a button or download a file",
    "tags": "button action link url external new tab download resume pdf document anchor navigate scroll destination close popup",
    "intro": "The On click group controls what a button does.",
    "steps": [
      "Choose Go to a section and select an existing section as Destination.",
      "Choose Open a content panel to open a Content panel section, or Close content panel for a close control.",
      "Choose Open a link in a new tab for an external URL.",
      "For a resume or model download, upload the file in Assets, then use the Download action and its file/path field. Remote hosts can override download behaviour.",
      "Test actions in Browse mode; Edit mode is for selection."
    ],
    "action": "inspector",
    "related": [
      "popup",
      "assets",
      "buttons"
    ]
  },
  {
    "id": "lists",
    "title": "Build a list of buttons, tags or images",
    "tags": "list items repeat repeated tags social buttons row column gap add item duplicate individual style",
    "intro": "Use one List component for related repeated items instead of splitting a cell for each item.",
    "steps": [
      "Drop List into a cell. In List layout, choose Item type: texts/tags, buttons/links, dropdowns, images, or images with text.",
      "Set Flow direction to Row or Column. Rows wrap to the next row; columns use Column height before wrapping across.",
      "Use Items → + Add, or select an item and press Ctrl+D / Cmd+D to duplicate it.",
      "Choose an item in the item picker or click it on the canvas to edit its content and action.",
      "Shared item appearance styles the list items. Turn on Individual style only for an item that should differ."
    ],
    "action": "inspector",
    "related": [
      "list-gap",
      "text",
      "actions"
    ]
  },
  {
    "id": "list-gap",
    "title": "Reduce gaps between list items",
    "tags": "list spacing gap too far apart close together distance padding line height",
    "intro": "The list gap is only one source of space between items.",
    "steps": [
      "Select the List and open List layout. Reduce Gap · rem; zero is supported.",
      "Reduce Item padding · rem too. For text items, check Shared item appearance → Line height.",
      "For button items, check each item’s custom Height and Fit to content setting.",
      "Check the active device preview: tablet or mobile may have independent overrides."
    ],
    "action": "inspector",
    "related": [
      "lists",
      "responsive"
    ]
  },
  {
    "id": "image",
    "title": "Add an image and preserve its proportions",
    "tags": "image photo picture portrait upload crop fit contain cover caption alt thumbnail",
    "intro": "Upload an image to Assets, then assign it to an Image component.",
    "steps": [
      "Choose the image through the inspector’s Image field. Add a useful Image description / alt text.",
      "Choose contain to show the complete image, or cover to fill its frame with cropping.",
      "Adjust Width · % and Height · rem, and use Caption if needed.",
      "Enable Click to enlarge for a large image view in Browse mode."
    ],
    "action": "assets",
    "related": [
      "image-border",
      "image-blend",
      "assets"
    ]
  },
  {
    "id": "image-border",
    "title": "Set image borders and individual corners",
    "tags": "image border outline width radius rounded corner colour color",
    "intro": "Image border controls are separate from general component styling.",
    "steps": [
      "Select the Image and expand Image border. Set Width, Color and radius.",
      "Keep corners linked for one radius on all four corners. Unlink to edit individual corners.",
      "Use the circular canvas corner handles for visual adjustment, or the numeric inspector fields for precise values."
    ],
    "action": "inspector",
    "related": [
      "corners",
      "image-blend"
    ]
  },
  {
    "id": "image-blend",
    "title": "Blend image edges into the background",
    "tags": "image edges fade blend feather tint colour color seamless background",
    "intro": "Image edge blending fades the image into what is behind it.",
    "steps": [
      "Select the Image component and expand Image edge blending.",
      "Enable Blend edges, then adjust Fade width · %.",
      "Leave Tint color blank to reveal the actual background, or set a tint and adjust Tint strength.",
      "The image border and caption are outside this fade. Preview against the intended background."
    ],
    "action": "inspector",
    "related": [
      "background",
      "image-border",
      "blend"
    ]
  },
  {
    "id": "background",
    "title": "Change a background, overlay or gradient",
    "tags": "background colour color colors overlay gradient opacity solid layer fill angle",
    "intro": "Background layers belong to the selected section or cell; Appearance controls a component’s own fill.",
    "steps": [
      "Select a section or cell in the hierarchy and open Background layers. Add one Base fill color for a solid, or multiple colors for a gradient.",
      "Adjust Gradient angle and Layer opacity. The Overlay group has its own colors, angle and opacity.",
      "Choose an image in the Image field and adjust its opacity, fit and position.",
      "For a selected component, use the Background toolbar shortcut or Appearance → Fill."
    ],
    "action": "inspector",
    "related": [
      "image-blend",
      "corners",
      "website-settings"
    ]
  },
  {
    "id": "corners",
    "title": "Adjust linked or separate corners",
    "tags": "corner radius rounded rounding lock linked unlink circle border",
    "intro": "You can change all corners together or edit each corner separately.",
    "steps": [
      "Select a component and drag its circular corner handles inward to round it or outward to square it.",
      "Use the corner lock or Link corners setting to link/unlink the four corners.",
      "For a cell or background, use Adjust corners on canvas in the corresponding inspector group.",
      "Numeric corner fields are useful when the selected element is very small."
    ],
    "action": "inspector",
    "related": [
      "image-border",
      "resize"
    ]
  },
  {
    "id": "blend",
    "title": "Blend neighbouring cells",
    "tags": "blend seam cells intersection boundary seamless line gap",
    "intro": "Cell blending softens a boundary between neighbouring cells.",
    "steps": [
      "Select or hover the parent split and use the blend toggle at the relevant intersection.",
      "Toggle it again to turn blending off. The inspector also exposes the split’s blend controls.",
      "Check the parent gap, borders and both cells’ backgrounds if a line remains. Different images cannot always be made visually continuous by a fade alone."
    ],
    "action": "inspector",
    "related": [
      "split",
      "image-blend"
    ]
  },
  {
    "id": "projects",
    "title": "Add or remove project cards",
    "tags": "projects cards games work portfolio add remove delete project card",
    "intro": "Create a Projects section for repeatable project cards and categories.",
    "steps": [
      "Choose + Add section → Projects. Use the add-project control after the cards or Projects → + Add project in the section inspector.",
      "Set the project name, thumbnail, description, tags, facts and category membership.",
      "Select the card to edit it. Its remove control asks for confirmation; removing a card keeps its project page and assets available.",
      "Cards & filters controls the card design, cards per row, and which details appear."
    ],
    "action": "sections",
    "related": [
      "project-pages",
      "categories",
      "image"
    ]
  },
  {
    "id": "project-pages",
    "title": "Set up project detail pages",
    "tags": "project page layout card opens inline external copy template duplicate details",
    "intro": "A project card can open a detail page, replace the cards inline, or visit an external URL.",
    "steps": [
      "In the card’s settings, choose how it opens and assign its page or URL.",
      "When adding a project, use the option to copy an existing project layout if you want the same structure. Copied layouts are independent, while asset paths can still be shared.",
      "Use the preview page chooser to edit a detail page, then add subsections, splits and components there.",
      "Test the card in Browse mode, including returning to the cards from an inline detail view."
    ],
    "action": "inspector",
    "related": [
      "projects",
      "subsections",
      "code"
    ]
  },
  {
    "id": "categories",
    "title": "Organize projects with categories",
    "tags": "categories category filter sidebar tabs map tags projects",
    "intro": "Project categories decide which cards appear under a filter.",
    "steps": [
      "Select the Projects section and edit its Categories in the inspector.",
      "Assign one or more categories to each project card.",
      "Under Cards & filters → Categories display, choose Category buttons, Filter sidebar, or Hide categories.",
      "Tags displayed on a card are separate from category membership."
    ],
    "action": "section-settings",
    "related": [
      "projects",
      "project-pages"
    ]
  },
  {
    "id": "subsections",
    "title": "Add or resize content subsections",
    "tags": "subsection block infinite height content long page collapse initially collapsed heading",
    "intro": "Infinite sections, project detail pages and content panels contain subsections.",
    "steps": [
      "Select the section and use + Add subsection in the canvas or the subsection controls in its inspector.",
      "Select the subsection in the hierarchy. Set Height behavior to Height · rem or Height · % of viewport, then change its Height.",
      "Use Select subsection grid to split its canvas and place components. Leave Heading empty to omit the heading.",
      "To make it collapsible, enable Allow visitors to collapse and choose Initially collapsed if needed."
    ],
    "action": "inspector",
    "related": [
      "split",
      "code",
      "popup"
    ]
  },
  {
    "id": "popup",
    "title": "Create a slide-up content panel",
    "tags": "popup pop up content panel drawer bottom close modal",
    "intro": "A Content panel section stays out of the main page flow and opens from a button.",
    "steps": [
      "Use + Add section and choose Content panel. Add subsections, splits and content.",
      "Create a button elsewhere, set On click to Open a content panel, and choose the panel.",
      "For a custom close button inside it, choose the Close content panel action.",
      "Test opening and closing in Browse mode."
    ],
    "action": "sections",
    "related": [
      "actions",
      "subsections"
    ]
  },
  {
    "id": "navigation",
    "title": "Add a navigation bar",
    "tags": "navbar nav navigation menu top bar sticky fixed header links rows",
    "intro": "There are two ways to create navigation.",
    "steps": [
      "For a simple bar, open Website settings → Top navigation and enable Show navigation. Set brand, links, social links and Height · rem.",
      "Enable Keep visible on scroll for a sticky bar, or disable it to let the bar scroll away.",
      "For a custom layout, add a Navigation bar section. Its rows can contain splits and components.",
      "The Navigation bar section has its own Height and Stay visible on scroll settings."
    ],
    "action": "website-settings",
    "related": [
      "actions",
      "split"
    ]
  },
  {
    "id": "video",
    "title": "Show a YouTube video",
    "tags": "video youtube mp4 import upload playback autoplay embed",
    "intro": "New videos use YouTube URLs; uploading local video files is not supported in this creator.",
    "steps": [
      "Drop a Video component into a cell and paste its YouTube URL.",
      "Set Title, Aspect ratio and an optional Custom poster.",
      "Gallery slides can also use a YouTube URL by choosing the video slide kind.",
      "Playback requires internet access and an embeddable video. Test it in Browse mode."
    ],
    "action": "components",
    "related": [
      "gallery",
      "assets"
    ]
  },
  {
    "id": "gallery",
    "title": "Build an image slideshow",
    "tags": "gallery slideshow carousel multiple images slides arrows lightbox",
    "intro": "A Gallery holds multiple image or YouTube slides.",
    "steps": [
      "Drop Gallery into a cell and select + Add slide in its inspector.",
      "For each slide, choose its kind, assign the image or YouTube URL, and edit the caption and image description.",
      "Set Image height, Image fit, Navigation arrows and Click images to enlarge.",
      "Test the slideshow in Browse mode."
    ],
    "action": "components",
    "related": [
      "image",
      "video"
    ]
  },
  {
    "id": "code",
    "title": "Show readable code snippets",
    "tags": "code snippet programming file name language wrap horizontal vertical scroll explanation",
    "intro": "A Code snippet component keeps code, file information and explanation together.",
    "steps": [
      "Drop Code snippet into a cell and enter File name, Language label and Code.",
      "Enable Wrap long lines to avoid horizontal scrolling. Set Scrollable height for the vertical limit.",
      "Optionally set First line number and Highlight lines such as 2-5, 9.",
      "Write Explanation below code. Add more components in additional cells or subsections for multiple snippets."
    ],
    "action": "components",
    "related": [
      "subsections",
      "text"
    ]
  },
  {
    "id": "models",
    "title": "Display or download a 3D model",
    "tags": "3d model sketchfab fbx obj mesh interactive viewer",
    "intro": "The interactive 3D model component uses Sketchfab.",
    "steps": [
      "Drop 3D model into a cell and paste a public Sketchfab model link.",
      "Set its Title and Viewer height, then test in Browse mode.",
      "Uploading an FBX to Assets does not create an interactive viewer. Use a button’s Download action to offer that file, or host the model on Sketchfab for embedding."
    ],
    "action": "components",
    "related": [
      "actions",
      "assets"
    ]
  },
  {
    "id": "contact",
    "title": "Create a contact form",
    "tags": "contact form email message gmail send submission endpoint phone",
    "intro": "Without a form service, the contact component opens an email composer; it does not send email itself.",
    "steps": [
      "Drop Contact form into a cell and set Recipient email, Heading and Button label.",
      "Choose whether to ask for a phone number and show a Gmail option.",
      "An Optional HTTPS form endpoint can send submissions through a compatible external service. Test the endpoint after hosting; do not place secret keys in the portfolio.",
      "Use Website settings → Contact side panel for a simpler floating contact panel."
    ],
    "action": "components",
    "related": [
      "actions",
      "website-settings"
    ]
  },
  {
    "id": "icons",
    "title": "Choose icons and social symbols",
    "tags": "icon icons instagram github linkedin logo symbol search library",
    "intro": "Icons can be decorative components or part of buttons.",
    "steps": [
      "Drop Icon into a cell for a decorative icon. It has no click action; use a Button for a clickable icon.",
      "Choose icon opens a searchable library with categories, names and previews.",
      "Set Icon size and an Accessible description. For a button with no text, clear its Label and keep the description.",
      "Use Icon image if the desired symbol is not in the library."
    ],
    "action": "components",
    "related": [
      "buttons",
      "lists"
    ]
  },
  {
    "id": "dropdown",
    "title": "Create a dropdown of destinations",
    "tags": "dropdown drop down select options choices destination menu",
    "intro": "A Dropdown has a label and a list of options with actions.",
    "steps": [
      "Drop Dropdown into a cell and set its Label.",
      "Add and edit its options in the inspector. Give each option text and its intended action.",
      "Use Browse mode to test selection and navigation. Lists can also contain dropdown items."
    ],
    "action": "components",
    "related": [
      "actions",
      "lists"
    ]
  },
  {
    "id": "assets",
    "title": "Upload and organize assets",
    "tags": "asset library upload image document folder directory drag drop rename move archive webp file",
    "intro": "Assets opens the library, with folders on the left and files on the right.",
    "steps": [
      "Choose a section’s asset folder and upload your files. You can add subfolders inside the allowed section folders.",
      "Dropping an external image on the canvas asks where to save it first. Internal component drags reuse the existing asset.",
      "Use the asset’s Move or Rename control to organize it. References are updated across device layouts; names must be unique at the destination.",
      "Protected section roots and Archive roots cannot be renamed or deleted. Archive does not allow subfolders."
    ],
    "action": "assets",
    "related": [
      "optimization",
      "image",
      "export"
    ]
  },
  {
    "id": "optimization",
    "title": "Optimize uploaded images",
    "tags": "optimize image webp compression quality slow loading lazy performance",
    "intro": "Supported raster uploads can be converted to WebP automatically.",
    "steps": [
      "Open Website settings → Image optimization.",
      "Adjust Convert supported uploads to WebP, WebP quality and Maximum image dimension. Smaller originals are not enlarged.",
      "SVG, GIF, animated PNG and existing WebP are preserved. Unsupported formats are kept with a notification.",
      "Below-the-fold images and heavy media use deferred loading. File dimensions and the visitor’s connection still affect speed."
    ],
    "action": "website-settings",
    "related": [
      "assets",
      "video"
    ]
  },
  {
    "id": "responsive",
    "title": "Change tablet and mobile layouts",
    "tags": "responsive tablet mobile phone device desktop laptop override small screen",
    "intro": "Desktop is the base layout. Tablet and mobile inherit it until a value is overridden.",
    "steps": [
      "Use the device selector above the canvas to choose Tablet or Mobile before editing.",
      "Adjust splits, dimensions, card columns and styling for that device. Other device overrides stay independent.",
      "For a split, Phone flow can stack columns on phones. Check text and image fit after resizing.",
      "Reset this device to Desktop removes that device’s overrides after confirmation. Assets are shared across devices."
    ],
    "action": "device",
    "related": [
      "split",
      "preview",
      "resize"
    ]
  },
  {
    "id": "preview",
    "title": "Test Browse and Full view",
    "tags": "preview browse full view actual live website test clicks exit escape",
    "intro": "Edit selects content; Browse runs the website’s interactions.",
    "steps": [
      "Choose Browse to test buttons, project pages, galleries and panels without editing controls.",
      "Choose Full view to use the browser window as the website viewport. Exit using its control or Escape.",
      "Full view uses the actual available width and can activate different responsive layouts from the selected device preview.",
      "If positioning differs, compare the same viewport dimensions and check device overrides before changing the base layout."
    ],
    "action": "browse",
    "related": [
      "responsive",
      "publish"
    ]
  },
  {
    "id": "isolation",
    "title": "Isolate a component",
    "tags": "isolate isolation ctrl 1 selected visibility focus",
    "intro": "Isolation gives a selected component more viewing space while editing.",
    "steps": [
      "Select a component, then choose Isolate or press Ctrl+1.",
      "Choose Isolate again to return to the normal canvas. The control is disabled when no component is selected.",
      "Use the inspector for changes while isolated. Isolation does not add a new website section."
    ],
    "action": "inspector",
    "related": [
      "resize",
      "preview"
    ]
  },
  {
    "id": "shortcuts",
    "title": "Use keyboard shortcuts and number dragging",
    "tags": "shortcut keyboard undo redo ctrl z y duplicate ctrl d scrub slide numeric values",
    "intro": "Shortcuts help when the canvas has focus; text fields keep their normal typing behaviour.",
    "steps": [
      "Ctrl+Z / Cmd+Z undoes; Ctrl+Y or Cmd+Shift+Z redoes.",
      "Ctrl+D / Cmd+D duplicates a selected list item. Ctrl+1 toggles isolation of a selected component.",
      "Arrow keys step cell alignment. Escape or a click on unused canvas background deselects.",
      "Drag a numeric field horizontally to adjust it; hold Shift for fine changes. Click to type an exact value."
    ],
    "action": "inspector",
    "related": [
      "move",
      "resize",
      "isolation"
    ]
  },
  {
    "id": "export",
    "title": "Save, export and reopen a portfolio",
    "tags": "save draft export zip backup import open reopen config files html storage offline",
    "intro": "A local draft, an exported ZIP and a published website are different copies.",
    "steps": [
      "Save draft stores the current work in this browser on this device. It is not an online backup.",
      "Workspace → Export website downloads the complete portfolio with configuration files and assets.",
      "Workspace → Open ZIP reopens a supported CraftCareer export. Arbitrary third-party website ZIPs are not supported.",
      "To host an exported portfolio manually, extract it and upload its contents, with index.html at the root. Do not upload only the ZIP."
    ],
    "action": "workspace",
    "related": [
      "publish",
      "recovery"
    ]
  },
  {
    "id": "publish",
    "title": "Publish or update with GitHub",
    "tags": "publish publishing host github live deploy update repository repo website online",
    "intro": "Publishing requires the configured CraftCareer server and a GitHub connection.",
    "steps": [
      "Open Publish, connect GitHub, choose a repository name and publish. Wait for deployment to finish before opening the live URL.",
      "After editing an existing published portfolio, use Update website. You do not need to unpublish first.",
      "Use Refresh status to check the latest deployment. Uploading files and finishing the GitHub Pages build are separate stages.",
      "Unpublish removes Pages hosting; Disconnect removes the current connection. Workspace → Open GitHub opens a previously published CraftCareer portfolio."
    ],
    "action": "publish",
    "related": [
      "publish-trouble",
      "export",
      "github-open"
    ]
  },
  {
    "id": "publish-trouble",
    "title": "Troubleshoot a live update or GitHub connection",
    "tags": "github error oauth expired callback custom domain update not showing old live deploying failed refresh cache",
    "intro": "This guide cannot inspect your GitHub account or server logs.",
    "steps": [
      "Use Publish → Refresh status and check whether the newest deployment is live or failed. Wait for the current build rather than repeatedly unpublishing.",
      "If the build is live but the browser shows old content, refresh the live page and confirm you are viewing the correct repository URL.",
      "If sign-in fails after changing domains, the site owner should check PUBLIC_ORIGIN and the GitHub OAuth callback host. Start a fresh connection on the intended domain.",
      "For a reported build or server error, record the exact message and check the deployment logs; do not share tokens or secrets in chat."
    ],
    "action": "publish",
    "related": [
      "publish",
      "github-open"
    ]
  },
  {
    "id": "github-open",
    "title": "Reopen a published GitHub portfolio",
    "tags": "open github existing repository published project separate copy",
    "intro": "Open GitHub is under Workspace, separate from the Publish dialog.",
    "steps": [
      "Choose Workspace → Open GitHub and connect your account if needed.",
      "Choose the portfolio you previously published with CraftCareer and open it.",
      "Keep a ZIP backup before replacing the current draft. Opening retrieves the published files, not unuploaded local changes."
    ],
    "action": "workspace",
    "related": [
      "publish",
      "export"
    ]
  },
  {
    "id": "sharing",
    "title": "Share a canvas with the right permission",
    "tags": "share sharing cclink viewer helper instance editor collaborate sent links invite",
    "intro": "Choose Workspace → Share canvas to generate a new link.",
    "steps": [
      "Viewer allows viewing only. Instance editor gives a separate copy whose edits do not change your canvas.",
      "Helper allows someone to help edit the shared canvas. Helpers choose a name and see other participants’ named cursors; the sender is Owner.",
      "Workspace → Sent links lists created links and lets you revoke one or all. A previously imported independent copy remains usable after revocation.",
      "Sharing is temporary: server restart/redeployment or expiry can end links. Save ZIP backups; concurrent edits may require conflict review."
    ],
    "action": "workspace",
    "related": [
      "sharing-trouble",
      "export"
    ]
  },
  {
    "id": "sharing-trouble",
    "title": "When a shared canvas cannot be edited",
    "tags": "viewer read only revoked expired link conflict helper cannot edit sharing",
    "intro": "Check the link’s role and validity before changing the layout.",
    "steps": [
      "A Viewer link is intentionally read-only. Ask the owner for a Helper link to collaborate, or an Instance editor link for an independent copy.",
      "Expired or revoked links cannot be restored by this guide. Ask the owner to generate a fresh link.",
      "Temporary rooms can disappear when the server restarts. Keep exports as backups.",
      "If both people edit the same revision, review the conflict rather than assuming the latest upload preserved everyone’s edits."
    ],
    "action": "workspace",
    "related": [
      "sharing",
      "export"
    ]
  },
  {
    "id": "website-settings",
    "title": "Change website-wide settings",
    "tags": "website settings site global theme font title background scrollbar navigation footer contact",
    "intro": "Website settings affects the portfolio. Creator appearance changes only the editing application.",
    "steps": [
      "Choose Website settings in the top bar for browser-tab title, description, global font, colors and back-to-top behaviour.",
      "Its other groups include Image optimization, Scrollbars, Top navigation, Contact side panel and Footer.",
      "Use Workspace → Creator appearance or the Light/Dark switch to change the editor itself."
    ],
    "action": "website-settings",
    "related": [
      "background",
      "navigation",
      "scrollbars"
    ]
  },
  {
    "id": "scrollbars",
    "title": "Customize website scrollbars",
    "tags": "scrollbar scroll bar thumb track color width thin radius",
    "intro": "Custom scrollbar settings apply to the exported portfolio, subject to browser support.",
    "steps": [
      "Open Website settings → Scrollbars and enable Custom scrollbars.",
      "Set Thumb color, Track color, Hover color, Width, Corner radius and Thin style.",
      "Test in Browse or on the exported site. Different browsers may render scrollbar details differently."
    ],
    "action": "website-settings",
    "related": [
      "website-settings"
    ]
  },
  {
    "id": "recovery",
    "title": "Recover missing work or diagnose clipping",
    "tags": "lost missing draft recover recovery reset clipped cropped inaccessible scroll inspector hidden bug broken",
    "intro": "Avoid replacing the draft until you have saved a backup of what remains.",
    "steps": [
      "Use Undo for recent changes in the current session. Save draft is tied to this browser and site origin; a new domain or different browser can have different storage.",
      "Reopen your last exported ZIP, or use Workspace → Open GitHub for the last published copy.",
      "For clipped content, compare the active device, cell fit, frame dimensions, section/subsection height and padding. Code has its own Scrollable height.",
      "For an inspector issue, reopen its panel and check browser zoom. If controls remain unreachable, note your window size and exact steps; this guide cannot diagnose every layout bug."
    ],
    "action": "workspace",
    "related": [
      "export",
      "responsive",
      "resize"
    ]
  },
  {
    "id": "hero-layout",
    "title": "Plan a profile layout with text and a portrait",
    "tags": "layout hero profile portrait text left image right design two columns social buttons name role",
    "intro": "A simple profile can use two columns and a small number of nested rows.",
    "steps": [
      "Create a Fit or Flexible profile section and split it into two columns. Adjust their percentages for the text and portrait areas.",
      "Split the text column into rows for name, role and actions, staying within three nested levels.",
      "Use a List of buttons for social or navigation actions. Put an Image in the other column and use contain for the whole portrait.",
      "Set backgrounds on the section and spacing on cells, then choose Tablet/Mobile and arrange a stacked version as needed."
    ],
    "action": "sections",
    "related": [
      "split",
      "lists",
      "responsive"
    ]
  },
  {
    "id": "hidden-ai",
    "title": "Where is From image?",
    "tags": "from image image ai design assistant screenshot generate analyse analysis hidden removed",
    "intro": "From image is hidden in this release. Its analysis code and bundled resources are retained.",
    "steps": [
      "Help supports Cloudflare AI answers when connected by the site owner, plus local built-in guides. Neither mode generates a design or makes changes to your canvas.",
      "The creator owner can restore the image entry by setting designAssistant.showLauncher to true in creator-config.js.",
      "For now, build a layout with sections, splits and components; the guide can explain these workflows."
    ],
    "action": "components",
    "related": [
      "hero-layout",
      "start"
    ]
  },
  {
    "id": "inspector",
    "title": "Find controls in the inspector",
    "tags": "inspector hierarchy select field collapsed expand reset controls settings",
    "intro": "The hierarchy selects a section, grid, cell or component. The inspector shows its applicable controls.",
    "steps": [
      "Click a hierarchy entry or select a component on the canvas. Expand its inspector groups to find fields.",
      "Drag the divider between Hierarchy and Inspector to give the inspector more height. Both panels scroll independently.",
      "The reset button beside a field restores that field’s default. The inspector back arrow returns toward section controls.",
      "The toolbar above the canvas exposes common fields. Use its Inspector button for more options."
    ],
    "action": "inspector",
    "related": [
      "components",
      "alignment"
    ]
  },
  {
    "id": "units",
    "title": "Understand rem and size values",
    "tags": "rem units pixels measurements numeric size px percentages percent",
    "intro": "Most sizing fields use rem; a rem follows the webpage’s root font size.",
    "steps": [
      "Read the unit in the field label. Image width and split ratios use percentages; many dimensions and padding fields use rem.",
      "A rem is not a fixed pixel count across every environment. Its pixel value depends on the root font size.",
      "Use the device previews and Browse mode to check the result. Drag a numeric value horizontally or type it directly."
    ],
    "action": "inspector",
    "related": [
      "resize",
      "responsive"
    ]
  },
  {
    "id": "spacer",
    "title": "Add intentional empty space",
    "tags": "spacer blank whitespace empty vertical space height",
    "intro": "A Spacer is a component for deliberate vertical space.",
    "steps": [
      "Drop Spacer into an unsplit cell and adjust Height · rem in its inspector.",
      "For space around another component, change the cell’s Padding or the parent split’s Space between cells instead."
    ],
    "action": "components",
    "related": [
      "alignment",
      "split"
    ]
  },
  {
    "id": "divider",
    "title": "Add a dividing line",
    "tags": "divider separator line thickness rule horizontal",
    "intro": "Use Divider when you want a visible dividing line.",
    "steps": [
      "Drop Divider into a cell and select it.",
      "Use its Appearance border thickness and color controls to style the line. Resize the frame or cell to adjust its available width."
    ],
    "action": "components",
    "related": [
      "background",
      "resize"
    ]
  }
];
const data={version:"1.6.0",reviewed:"2026-10-26",topics}; G.CraftHelpKnowledge=data;if(typeof module!=="undefined")module.exports=data;
})(globalThis);
