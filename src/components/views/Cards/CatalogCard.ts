import { Card } from "./Card";
import { IProduct } from "../../../types";
import { IEvents } from "../../base/Events";

export class CatalogCard extends Card {
  private currentProduct: IProduct | null = null;

  constructor(protected events: IEvents) {
    super(events, "#card-catalog");

    this.container.addEventListener("click", () => {
      if (this.currentProduct) {
        this.events.emit("product:select", this.currentProduct);
      }
    });
  }

  render(product: IProduct): HTMLElement {
    this.renderBase(product);
    this.currentProduct = product;
    return this.container;
  }
}
