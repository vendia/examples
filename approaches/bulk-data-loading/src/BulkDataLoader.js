import dotenv from 'dotenv'
import {CSVFileProcessor} from "./CSVFileProcessor.js";
import {InventoryVerifier} from "./InventoryVerifier.js";

dotenv.config({path: "./.share.env"})

await new CSVFileProcessor().processInventoryFile();

await new InventoryVerifier().waitForCompleteInventory();

