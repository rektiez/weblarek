import { IProduct } from "../../types";
import { EventEmitter } from "../base/Events";

export class Cart {
  private items: IProduct[] = [];
  constructor(private events: EventEmitter) {}

  getItems(): IProduct[] {
    return this.items;
  }

  hasItem(productId: string): boolean {
    return this.items.some((item) => item.id === productId);
  }

  clear(): void {
    this.items = [];
    this.events.emit("basket:changed");
  }

  getCount(): number {
    return this.items.length;
  }

  getTotal(): number {
    return this.items.reduce((total, item) => total + (item.price ?? 0), 0);
  }

  removeItem(productId: string): void {
    this.items = this.items.filter((item) => item.id !== productId);
    this.events.emit("basket:changed");
  }

  addItem(product: IProduct): void {
    if (!this.items.some((p) => p.id === product.id)) {
      this.items.push(product);
      this.events.emit("basket:changed");
    }
  }
}
