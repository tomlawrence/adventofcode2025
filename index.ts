import * as readline from "readline";
import { spawn } from "child_process";
import * as fs from "fs";
import * as path from "path";

interface MenuItem {
  day: number;
  path: string;
}

class AdventMenu {
  private items: MenuItem[] = [];
  private selectedIndex = 0;
  private rl: readline.Interface;
  private isRunning = false;

  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    // Enable raw mode for key detection
    if (process.stdin.isTTY) {
      process.stdin.setRawMode(true);
    }

    readline.emitKeypressEvents(process.stdin);
  }

  private scanDays(): void {
    const rootDir = process.cwd();

    for (let day = 1; day <= 25; day++) {
      const dayStr = day.toString().padStart(2, "0");
      const dayDir = path.join(rootDir, `day${dayStr}`);
      const dayFile = path.join(dayDir, `day${dayStr}.ts`);

      if (fs.existsSync(dayFile)) {
        this.items.push({ day, path: dayFile });
      }
    }
  }

  private clear(): void {
    console.clear();
  }

  private render(): void {
    this.clear();
    console.log("🎄 Advent of Code 2025 🎄\n");
    console.log("Use ↑/↓ to navigate, Enter to select, q to quit\n");

    this.items.forEach((item, index) => {
      const prefix = index === this.selectedIndex ? "→ " : "  ";
      const dayStr = `Day ${item.day.toString().padStart(2, "0")}`;
      console.log(`${prefix}${dayStr}`);
    });
  }

  private async runDay(item: MenuItem): Promise<void> {
    this.isRunning = true;
    this.clear();
    console.log(
      `\n🎅 Running Day ${item.day.toString().padStart(2, "0")}...\n`,
    );

    return new Promise((resolve) => {
      const child = spawn("ts-node", [item.path], {
        stdio: "inherit",
      });

      child.on("close", (code) => {
        if (code !== 0) {
          console.log(`\n\n⚠️  Process exited with code ${code}`);
        }
        console.log("\n\nPress any key to return to menu...");

        const handler = () => {
          process.stdin.removeListener("keypress", handler);
          this.isRunning = false;
          resolve();
        };

        process.stdin.once("keypress", handler);
      });
    });
  }

  public async start(): Promise<void> {
    this.scanDays();

    if (this.items.length === 0) {
      console.log("No Advent of Code days found!");
      console.log("Expected format: day01/day01.ts, day02/day02.ts, etc.");
      process.exit(0);
    }

    this.render();

    process.stdin.on("keypress", async (str: string, key: any) => {
      if (this.isRunning) {
        return; // Ignore keypresses while a day is running
      }

      if (key.name === "q" || (key.ctrl && key.name === "c")) {
        this.cleanup();
        process.exit(0);
      }

      if (key.name === "up") {
        this.selectedIndex = Math.max(0, this.selectedIndex - 1);
        this.render();
      } else if (key.name === "down") {
        this.selectedIndex = Math.min(
          this.items.length - 1,
          this.selectedIndex + 1,
        );
        this.render();
      } else if (key.name === "return") {
        const selected = this.items[this.selectedIndex];
        await this.runDay(selected);
        this.render();
      }
    });
  }

  private cleanup(): void {
    if (process.stdin.isTTY) {
      process.stdin.setRawMode(false);
    }
    this.rl.close();
  }
}

// Start the menu
const menu = new AdventMenu();
menu.start().catch(console.error);
