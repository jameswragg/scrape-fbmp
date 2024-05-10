async () => {
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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

  // const buttonSelector = `[aria-label="Allow all cookies"]`;
  // // const buttonSelector = `[data-testid="cookie-policy-manage-dialog-accept-button"]`;
  // const button = document.querySelector(buttonSelector);
  // if (button) {
  //   console.log("button found");
  //   button.click();
  //   await sleep(2000);
  // } else {
  //   console.log("button not seen");
  // }

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

        console.log({ price, description, location });

        return {
          description,
          price,
          location,
          url,
          image,
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
