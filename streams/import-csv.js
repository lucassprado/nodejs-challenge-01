import fs from 'node:fs';
import { parse } from "csv-parse"

const csvFilePath = new URL('./tasks.csv', import.meta.url);

const stream = fs.createReadStream(csvFilePath)

const csvParse = parse({
  delimiter: ',',
  skipEmptyLines: true,
  fromLine: 2,
})

async function run() {
  const csvLines = stream.pipe(csvParse);

  for await (const line of csvLines) {
    const [title, description] = line;

    await fetch('http://localhost:3333/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        description,
      })
    })
    
    await wait(500)
  }
}

run()

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
