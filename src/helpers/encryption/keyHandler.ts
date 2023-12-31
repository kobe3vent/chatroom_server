import { createDiffieHellman, DiffieHellman } from "crypto";

export class Keygeneration {
  private sender!: DiffieHellman;
  private recipient!: DiffieHellman;

  senderKey(): { key: string; prime: string; generator: string } {
    const first = createDiffieHellman(512);
    this.sender = first;
    const key = first.generateKeys("base64");
    const prime = first.getPrime("base64");
    const generator = first.getGenerator("base64");
    return {
      key,
      prime,
      generator,
    };
  }

  recipientKey(prime: string, generator: string): string {
    const second = createDiffieHellman(
      Buffer.from(prime, "base64"),
      Buffer.from(generator, "base64")
    );
    this.recipient = second;
    return second.generateKeys("base64");
  }

  senderSecret(recipientKey: string): string {
    const secret = this.sender.computeSecret(recipientKey, "base64", "base64");
    return secret;
  }

  recipientSecret(initiatorKey: string): string {
    const secret = this.recipient.computeSecret(
      initiatorKey,
      "base64",
      "base64"
    );
    return secret;
  }
}
