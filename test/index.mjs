import purify from "../src/purifycss.js";
import fs from "fs";

// const purify = require('../src/purifycss.js')
// const fs = require('fs')

// let html = `<div className="container">
// <div className="content delayed-content" style={{ visibility: 'visible' }}>
//   <h1 className="title" se="__element" data-obj="post.title">
//     Unused Cars with Zero Miles, Now Practically Free
//   </h1>
//   <div className="description" se="__element" data-obj="post.description">
//     <p>
//       In a market flooded with pre-owned vehicles, stumbling upon a car that has never been driven is akin to
//       discovering hidden treasure.{' '}
//       <strong>
//         These unused cars, straight from the factory, provide a unique chance to experience the thrill of a
//         new car without the hefty price tag.
//       </strong>
//     </p>
//   </div>
// </div>
// <div className="continue-template__btn delayed-content" style={{ visibility: 'visible', display: 'none' }}>
//   Read More
// </div>
// <div
//   id="pcontent"
//   className="content delayed-content"
//   se="__element"
//   data-obj="post.contents"
//   style={{ visibility: 'visible' }}
// >
//   <p>
//     <strong>
//       Whether you're a seasoned car enthusiast or a first-time buyer, the appeal of owning a vehicle with zero
//       miles is undeniable.
//     </strong>
//   </p>
//   <p>
//     <br />
//   </p>
//   <p>
//     <strong>Now, you might be wondering, how is this possible?</strong> The answer lies in a convergence of
//     factors that create the perfect conditions for car buyers. Manufacturers occasionally find themselves with
//     excess inventory due to overproduction, shifts in market demand, or design updates that make certain
//     models obsolete. Consequently, these unused cars with zero miles often find themselves stored in expansive
//     lots, awaiting their chance to hit the road.
//   </p>
//   <p>
//     <br />
//   </p>
//   <p>
//     <strong>But here's the twist </strong>– these manufacturers need to clear space and move inventory,
//     creating a once-in-a-lifetime opportunity for savvy car shoppers. The prices of these pristine, unused
//     vehicles are slashed to astonishingly low levels, making them practically free compared to their original
//     retail value. It's a win-win situation for both buyers and sellers, as manufacturers streamline their
//     operations, and consumers secure incredible deals on brand-new cars.
//   </p>
//   <p>
//     <br />
//   </p>
//   <p>
//     <strong>To take advantage of this extraordinary offer</strong>, all you need to do is check the rates.
//     Online platforms, dealerships, and auctions are buzzing with activity as these hidden gems become
//     available to the public. The competition is fierce, so acting quickly is paramount if you want to secure
//     the car of your dreams at an unbeatable price.
//   </p>
//   <p>
//     <br />
//   </p>
//   <p>
//     Imagine stepping into the driver's seat of a car that has never felt the touch of asphalt, its engine
//     humming with anticipation. Whether you're in search of a sleek sedan, a rugged SUV, or a stylish coupe,
//     the options are diverse, and the possibilities are endless. With the chance to own an unused car with zero
//     miles at practically no cost, the road ahead is paved with excitement and savings.
//   </p>
//   <p>
//     <br />
//   </p>
//   <p>
//     While the idea of getting a car for free may sound too good to be true, the concept here revolves around
//     exceptional discounts and deals that make the cost of these unused cars with zero miles almost negligible
//     compared to their original retail value. Here's a closer look at the factors contributing to this unique
//     opportunity:
//   </p>
//   <p>
//     <br />
//   </p>
//   <p>
//     <strong>Overstock and Inventory Clearance:</strong>
//   </p>
//   <p>
//     <br />
//   </p>
//   <p>
//     Car manufacturers occasionally find themselves with excess inventory due to various reasons such as
//     overproduction, changes in market demand, or the introduction of updated models.
//   </p>
//   <p>
//     To manage this surplus, manufacturers often resort to drastic measures to clear their lots and warehouses,
//     leading to significant discounts on the remaining inventory.
//   </p>
//   <p>
//     <strong>Market Dynamics:</strong>
//   </p>
//   <p>
//     <br />
//   </p>
//   <p>
//     The automotive market is dynamic and influenced by factors like consumer preferences, economic conditions,
//     and global events. Sudden shifts in these dynamics can result in an oversupply of certain car models.
//   </p>
//   <p>
//     To adapt to market changes, manufacturers may implement price reductions to stimulate demand and move
//     excess inventory quickly.
//   </p>
//   <p>
//     <strong>Auction and Clearance Sales:</strong>
//   </p>
//   <p>
//     <br />
//   </p>
//   <p>
//     Manufacturers and dealers frequently organize auctions or clearance sales to sell off unused cars quickly.
//     These events attract potential buyers looking for incredible deals.
//   </p>
//   <p>
//     Auctions, whether conducted online or in physical locations, provide a transparent and competitive
//     platform for buyers to bid on and acquire these virtually new vehicles at significantly reduced prices.
//   </p>
//   <p>
//     <br />
//   </p>
// </div>
// </div>
// `

let html = ["./template/template.html", "./template/template.js"];

// let css = fs.readFileSync("./index.css", "utf-8");
let css = ["./CSS/01.css", "./CSS/02.css"];

let options = {
  info: true,
  minify: false,
  output: "./newOutput.css",
  whitelist: [
    "container",
    "container::before",
    "button-active",
    "container[data-v78988729]",
    "*active*",
  ],
};

// console.log("css", css);

purify(html, css, options);
