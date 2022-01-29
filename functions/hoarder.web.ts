export const htmlPage = (text: string) => {
    return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@100;400&display=swap" rel="stylesheet">
    <style>
        body {
            margin: 0;
        }

        .fw-cont {
            width: 100vw;
            height: 100vh;
            background: #2c3e50; /* fallback for old browsers */
            background: -webkit-linear-gradient(to right, #2c3e50, #3498db); /* Chrome 10-25, Safari 5.1-6 */
            background: linear-gradient(to right, #2c3e50, #3498db); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Roboto', sans-serif;
            color: white;
        }
    </style>
    <title>Hoarder</title><meta content="Cryptoscopos data Hoarder" name="description" />
  </head>
  <body>
    <div><div class="fw-cont"><h1>${text}</h1></div></div>
    
  </body>
</html>`;
};
