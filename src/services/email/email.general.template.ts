export const generateTemplate = (title, html) => {
    return `
    <html>
    <head>
        <title>${title}</title>
        <meta name="viewport" content="width=device-width; initial-scale=1.0; maximum-scale=1.0; user-scalable=no;">
        <meta name="viewport" content="width=600,initial-scale = 2.3,user-scalable=no">
        <meta name="viewport" content="width=device-width">
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    </head>
    <body bgcolor="#F5F5F5" style="background-color: #F5F5F5">
    <div style="float: left; background-color: #F5F5F5; width: 100%; height: 100%; padding: 10px; box-sizing: border-box">
        <div style="max-width: 600px; margin: 10px auto; box-sizing: border-box;">
            <div style="clear: both; float: left; border: 1px solid #E0E0E0; background: white; padding: 30px">
                ${html}
            </div>
        </div>
    </div>
</body>
</html>
    `;
};
