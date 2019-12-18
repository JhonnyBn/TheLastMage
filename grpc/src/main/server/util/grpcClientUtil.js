export async function getClient(clients) {
    console.log("Clients", clients)
    return new Promise((resolve, reject) => {
        clients.forEach(client => {
            client.ping({}, (err, msg) => {
                if (!err) resolve(client)
            })
        });
    }
    )
}