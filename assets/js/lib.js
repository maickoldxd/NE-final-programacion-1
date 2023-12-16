const priceAsNumber = (price) => Number(price.replace("$", ""));

const formatToARS = (n) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(n);

const getProductsData = (productsClone) => {
  return productsClone.map((product, index) => {
    const price = priceAsNumber(product.querySelector(".price").textContent);
    const title = product
      .querySelector(".card-title")
      .textContent.toLowerCase();
    return { title, price, index };
  });
};

const sortProducts = ({ by }) => {
  const sortingMethods = {
    default: (a, b) => a.index - b.index,
    desc: (a, b) => b.price - a.price,
    asc: (a, b) => a.price - b.price,
    abc: (a, b) => a.title.localeCompare(b.title),
  };
  if (!Object.keys(sortingMethods).includes(by)) {
    throw new Error("Unknown sorting method");
  }

  let productsClone = [];
  document.querySelectorAll("figure").forEach((e) => {
    productsClone.push(e.cloneNode(true));
    e.remove();
  });

  const productData = getProductsData(productsClone);

  productData.sort(sortingMethods[by]);

  const renderHtmlProducts = productData.map(
    (product) => productsClone[product.index]
  );

  renderHtmlProducts.forEach((e) => {
    document.querySelector("#product-list").appendChild(e);
  });
};

document.querySelector("#sort-method").addEventListener("change", (e) => {
  sortProducts({
    by: e.target.value,
  });
});

/**
 *
 *
 * SHOPPING CART
 *
 *
 */

const shoppingCart = {
  products: {},
  add: (productData) => {
    if (!shoppingCart.products[productData.price]) {
      shoppingCart.products = {
        ...shoppingCart.products,
        [productData.price]: productData,
      };
    } else {
      shoppingCart.products[productData.price].quantity++;
    }
    shoppingCart.updateCounter();
    triggerNotification();
    shoppingCart.renderList();
    shoppingCart.updateTotal();
  },
  updateCounter: () => {
    document.getElementById("cart-counter").textContent = Object.values(
      shoppingCart.products
    ).reduce((acc, curr) => acc + curr.quantity, 0);
  },

  renderList: () => {
    const shoppingCartHtml = document.getElementById("shopping-cart-container");

    const cartProductListedTemplate = document.getElementById(
      "cart-product-listed"
    );
    const cartProductListedClone = cartProductListedTemplate.cloneNode(true);
    cartProductListedClone.classList.remove("hidden");

    shoppingCartHtml.innerHTML = "";

    Object.values(shoppingCart.products).forEach((product) => {
      const clonedCartItem = cartProductListedClone.cloneNode(true);
      clonedCartItem.querySelector("h4").textContent = product.title;
      clonedCartItem.querySelector(
        "#cart-product-quantity"
      ).textContent = `${product.quantity} unid.`;
      clonedCartItem.querySelector("#cart-product-price").textContent =
        formatToARS(product.price);

      shoppingCartHtml.appendChild(clonedCartItem);
    });

    cartProductListedClone.classList.toggle(
      "hidden",
      Object.keys(shoppingCart.products).length === 0
    );
  },

  updateTotal: () => {
    const htmlTotal = document.getElementById("cart-total");
    const total = Object.values(shoppingCart.products).reduce(
      (acc, curr) => acc + curr.quantity * curr.price,
      0
    );
    htmlTotal.textContent = formatToARS(total);
  },
};

let addToCartButtons = document.querySelectorAll(".add-to-card");

const handleAddToShoppingCart = (e) => {
  const figure = e.target.closest("figure");

  const title = figure.querySelector(".card-title").textContent;
  const price = priceAsNumber(figure.querySelector(".price").textContent);

  const productData = { title, price, quantity: 1 };

  shoppingCart.add(productData);
};

const triggerNotification = () => {
  const toast = document.getElementById("toast").classList;
  toast.toggle("invisible");
  setTimeout(() => {
    toast.toggle("invisible");
  }, 3000);
};
