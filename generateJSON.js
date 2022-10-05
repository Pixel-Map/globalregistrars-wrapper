var fs = require('fs');

const existing = [
];

(async () => {
    let cursor = ''
    let allItems = [];
    let totalItemsCounted = 0;
    // eslint-disable-next-line no-constant-condition
    while (true) {
        totalItemsCounted += 20;
        console.log('Counted: ' + totalItemsCounted)
        await new Promise(r => setTimeout(r, 2000));
        let url = `https://api.opensea.io/api/v1/assets?limit=20&collection=global-registrars&order_direction=desc&include_orders=false`
        if (cursor) {
            url = url + `&cursor=${cursor}`
        }
        const res = await fetch(url, {
            headers: {
                'X-API-KEY': ''
            }
        });
        let obj = await res.json();
        // console.log(obj)
        // console.log(obj)


        for (const item of obj.assets) {
            console.log(item.token_id)
            if (existing.includes(item.token_id)) {
                console.log('Found existing')
            } else {
                if (allItems.includes(item.token_id)) {
                    console.log("Already in it wat")
                } else {
                    allItems.push(item.token_id)
                }
            }
        }
        // console.log(obj.assets)
        if (obj.assets) {
            // allItems = [...allItems, ...obj.assets];
        }
        fs.writeFile("allItems.json", JSON.stringify(allItems), function (err) {
            if (err) {
                console.log(err);
            }
        });

        if (obj.next) {
            cursor = obj.next
        } else {
            console.log("Done!")
            return
        }
    }
})();
