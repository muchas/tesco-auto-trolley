# Tesco Auto Trolley

Create **Tesco** trolley automatically based on your **Todoist** list of meals.

Reduces shopping time to 15 minutes per week!

Currently project is aimed for __Polish__ users (https://ezakupy.tesco.pl/)


# Installation

Open Chrome browser and in the new tab go to `chrome://extensions`.

Click __Load unpacked extension...__ and select `dist` directory.


# Usage

### Configuration

Firstly let's create new project for your weekly meals list in Todoist App (https://todoist.com/).

![adding project to image](https://github.com/muchas/tesco-auto-trolley/blob/master/docs/todoist-project.png)

Then grab your Todoist API token from Settings > Integrations.

Put API token and project name in *Tesco Auto Trolley* settings and you're all set!

![auto trolley settings](https://github.com/muchas/tesco-auto-trolley/blob/master/docs/settings.png)


### Meals list

At this moment the following format is supported:

- First meal
  - ingredient 1
  - ingredient 2
  - ingredient 3
- Second meal
  - ingredient 2
  - ingredient 4
- 12 Mineral water (@produkt)

Only elements with indentation equal to 2 or with assigned label `produkt` (labels require Todoist premium account)
are imported as ingredients to your Tesco trolley.

Allowed ingredient formats:
- `pół łyżki <ingredient_name>`
- `<number> łyżek|łyżki|łyżek <ingredient_name>`
- `<number> <ingredient_name>`
- `<number>g <ingredient_name>`
- `<number>ml <ingredient_name>`
- `pół <ingredient_name>`
- `<ingredient_name>`

Example:

![meals list](https://github.com/muchas/tesco-auto-trolley/blob/master/docs/meal-list.png)


### Generating Tesco trolley

Log in to your Tesco account at https://ezakupy.tesco.pl/.

You should see blue button `Import products` on the right side of the page.

![blue import product button](https://github.com/muchas/tesco-auto-trolley/blob/master/docs/import-button.png)

After clicking the button please wait about 6 seconds, page should be automatically refreshed.

__Double check__ product quantities before finishing the order, errors are likely to appear!


# Known issues

- Lack of possibility to easily modify ingredient -> product mapping
- Problems with ingredient quantities, e.g `6 eggs` will result in 6 packages of 10 eggs

# Developer notes

### Build project

`npm install`

`npm run build`

`npm run watch`
