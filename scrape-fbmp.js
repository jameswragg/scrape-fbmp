async () => {
  const waitForDocumentLoad = () => {
    return new Promise((resolve) => {
      if (document.readyState === "complete") {
        resolve();
      } else {
        window.addEventListener("load", resolve);
      }
    });
  };

  await waitForDocumentLoad();

  const items = Array.from(
    document.querySelectorAll(`a[href^="/marketplace/item/"]`),
    (el) => {
      try {
        const url = new URL(el.getAttribute("href"), "https://www.facebook.com")
          .href;
        const $image = el.querySelector("img");
        let image = $image?.getAttribute("src") || "";
        if (image) image = decodeURI(image);

        const divs =
          el?.firstElementChild?.firstElementChild?.nextElementSibling?.querySelectorAll(
            ":scope > div"
          );

        if (divs.length < 3) {
          console.log("Not enough divs", divs.length);
          return;
        }

        const [price, description, location] = Array.from(divs).map((el) => {
          const priceTest = el.querySelector("span[dir='auto']");
          if (priceTest) {
            return decodeURI(priceTest.innerText.trim());
          }

          return el.innerText.trim();
        });

        return {
          description,
          price,
          location,
          // facebook add hashing to the URLs so every scrape was different & scuppered the usefulness of git scraping
          // url,
          // image,
        };
      } catch (e) {
        return e;
      }
    }
  );

  if (!items.length) {
    throw "No items found";
  }

  return items;
};
