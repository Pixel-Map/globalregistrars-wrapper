var fs = require('fs');

(async () => {
    let allItems = [];
    // code goes here
    let currentOffset = 0
    // eslint-disable-next-line no-constant-condition
    while (true) {
        console.log(`https://api.opensea.io/api/v1/assets?offset=${currentOffset}&limit=20&asset_contract_address=0xe29d4943197e439274c7500fa73fd40d9695bbf3`)
        const res = await fetch(`https://api.opensea.io/api/v1/assets?offset=${currentOffset}&limit=20&asset_contract_address=0xe29d4943197e439274c7500fa73fd40d9695bbf3`, {
            headers: {
                'X-API-KEY': 'KEY HERE'
            }
        });
        let obj = await res.json();
        // console.log(obj)
        if (obj.assets === 0) {
            return
        }
        for (const item of obj.assets) {
            console.log(item.token_id)
            if (allItems.includes(item.token_id)) {
                console.log("Already in it wat")
            } else {
                allItems.push(item.token_id)
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
        currentOffset = currentOffset + 20
    }
})();
