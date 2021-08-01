// 'Content-Type: application/graphql'
// 'X-Shopify-Access-Token: {access_token}'

async function FetchSample(accessToken, body) {
  await fetch("https://google.com", {
    method: "POST",
    headers: {
      "X-Shopify-Access-Token": accessToken,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}
