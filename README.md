# e-Nivaran Frontend Integration Guide

This guide provides comprehensive instructions for integrating the e-Nivaran frontend assets (`HTML`, `CSS`, `JS`) into an existing PHP application. Following these steps will ensure a smooth, break-free integration.

The frontend is built with **Tailwind CSS** and vanilla **JavaScript**, designed to be modular and responsive.

-----

## ✨ Features

  * **Modular Partials**: Reusable Header, Sidebar, and Footer components.
  * **Responsive Design**: Mobile-first layout that adapts from small phones to large desktops.
  * **Dynamic Components**: The `index.html` page features a multi-step login form.
  * **Interactive UI**: JavaScript-driven mobile sidebar (off-canvas), animations, and component loading.
  * **Production-Ready**: Clean structure ready for a PHP backend.

-----

## 📁 1. Recommended Folder Structure

To ensure that paths work correctly and the project remains maintainable, organize the provided files into the following structure within your PHP application's root directory.

```
/your-php-project
│
├── index.php
├── dashboard.php
├── register.php
├── grievance-history.php
│
├── partials/
│   ├── header.php
│   ├── sidebar.php
│   └── footer.php
│
└── assets/
    ├── css/
    │   └── style.css
    └── js/
        └── script.js
```

-----

## 🛠️ 2. Step-by-Step Integration Guide

Follow these steps carefully to integrate the frontend components.

### Step 2.1: Organize and Rename Files

First, place the provided files into the new structure and rename the `.html` files to `.php`.

1.  **Move Partials**:

      * Move `header.html` to `partials/header.php`
      * Move `sidebar.html` to `partials/sidebar.php`
      * Move `footer.html` to `partials/footer.php`

2.  **Move Assets**:

      * Move `styles.css` to `assets/css/style.css`
      * Move `script.js` to `assets/js/script.js`

3.  **Convert Main Pages**:

      * Rename `index.html` to `index.php` and place it in your project root.
      * Rename `dashboard.html` to `dashboard.php` and place it in your project root.
      * Rename `register.html` to `register.php` and place it in your project root.
      * Rename `grievancehistory.html` to `grievance-history.php` and place it in your project root.

### Step 2.2: Link Assets Correctly

To avoid broken paths for CSS and JS files, it's best practice to define a base URL.

1.  **Create a `config.php` (Recommended)**: In your project root, create a file named `config.php` and define a constant for your application's base URL.

    ```php
    <?php
    // config.php

    // Define the base URL of your application
    // Example for localhost: define('BASE_URL', 'http://localhost/your-php-project');
    // Example for production: define('BASE_URL', 'https://www.yourdomain.com');
    define('BASE_URL', 'http://localhost/your-php-project');
    ?>
    ```

2.  **Update Asset Links in `partials/header.php`**: Open `partials/header.php` and modify the links to use the `BASE_URL` constant. This ensures they always point to the right location.

    **REPLACE THIS:**

    ```html
    <link rel="stylesheet" href="styles.css" />
    ```

    **WITH THIS:**

    ```html
    <link rel="stylesheet" href="<?php echo BASE_URL; ?>/assets/css/style.css" />
    ```

    Do the same for any JavaScript files linked in your header or footer partials. For example, in `index.php`, the script tag should be:

    ```html
    <script src="<?php echo BASE_URL; ?>/assets/js/script.js"></script>
    ```

### Step 2.3: Integrate Partials into Main Pages

Now, edit your main PHP pages (`index.php`, `dashboard.php`, etc.) to include the partials. This is where you replace the static HTML with dynamic PHP `include` statements.

Below is an example of how to structure `dashboard.php`. Apply the same logic to `index.php`, `register.php`, and `grievance-history.php`.

**Example: `dashboard.php`**

```php
<?php
// Include the config file at the top of every page
require_once 'config.php';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - e-Nivaran</title>
    
    <?php include 'partials/header.php'; ?>
    
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body class="page-dashboard bg-background font-sans">
    
    <div class="app-container">
        
        <?php include 'partials/sidebar.php'; ?>
        
        <main class="main-content">
            <div class="p-4 sm:p-6 lg:p-8">
                <header class="mb-8">
                    <h1 class="text-3xl font-bold">Dashboard</h1>
                </header>
                </div>
            
            <?php include 'partials/footer.php'; ?>
        </main>
    </div>

    <script src="<?php echo BASE_URL; ?>/assets/js/script.js"></script>
</body>
</html>
```

-----

## ⚙️ 3. How It Works: Interactivity & Responsiveness

The responsive behavior is handled entirely by the frontend assets and requires no extra PHP logic.

  * **CSS (`style.css`)**: Manages the mobile-first layout, the fixed positioning of the header/footer, and the responsive transition of the sidebar from off-canvas (mobile) to fixed (desktop).
  * **JavaScript (`script.js`)**: Handles all user interactions, including below:
      * Toggling the mobile sidebar.
      * The logic for the 3-step login form on `index.php`.
      * Initializing charts and animations on `dashboard.php`.
  * **Page-Specific Body Class**: The `script.js` file checks for a class on the `<body>` tag (e.g., `.page-index`, `.page-dashboard`) to run page-specific code. Make sure to add the correct class to the body of each of your main PHP files.

-----

## 🔗 4. Dependencies

The project relies on two external CDNs for core styling and icons.

  * **Tailwind CSS**: Used for the utility-first CSS framework.
  * **Font Awesome**: Used for all icons.

These are linked in `partials/header.php`. For production, you have two options:

1.  **Keep the CDNs (Recommended for simplicity)**: This is the easiest approach and benefits from the CDN's caching.
2.  **Host Locally**: For environments without internet access or for full control, you can download these libraries and host them from your `assets/` folder. Remember to update the links in `partials/header.php`.

-----

## 🚀 5. Production Deployment Notes

Before deploying to a production server, consider the following best practices:

  * **Minification**: Minify `assets/css/style.css` and `assets/js/script.js` to reduce file sizes and improve load times. Tools like `terser` for JS and `cssnano` for CSS are excellent choices.
  * **Caching**: To ensure users get the latest version of your assets after an update, append a version number to your asset links. This is known as "cache busting."
    ```php
    <link rel="stylesheet" href="<?php echo BASE_URL; ?>/assets/css/style.css?v=1.0.1">
    <script src="<?php echo BASE_URL; ?>/assets/js/script.js?v=1.0.1"></script>
    ```
  * **Testing**: Thoroughly test the integration in a staging environment. Check all pages, form submissions, and responsive breakpoints to ensure nothing broke during the integration.

-----

## ⚡ Quick Start Guide (5 Steps)

For a fast setup, follow these five steps:

1.  **Organize Files**: Create `partials/` and `assets/` directories. Move and rename all provided files into the structure outlined in **Section 1**.
2.  **Create `config.php`**: Create a `config.php` file in your root and define your `BASE_URL` constant.
3.  **Update Asset Links**: In `partials/header.php`, change the link for `style.css` to use the `BASE_URL` constant. Do the same for the `script.js` link in your main PHP files.
4.  **Add PHP Includes**: Edit `index.php`, `dashboard.php`, etc. a) `require_once 'config.php';` at the top, and b) replace the static header, sidebar, and footer HTML with `<?php include '...'; ?>` statements.
5.  **Add Body Classes**: Make sure each main page (`index.php`, `dashboard.php`) has the appropriate class on its `<body>` tag (e.g., `class="page-index"`) for JavaScript to work correctly.
