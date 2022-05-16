import clientPromise from "../../../src/utils/mongodb";

async function handler(req, res) {
	const payment = req.body;

	try {
		const client = await clientPromise;
		const db = client.db();

		const result = await db.collection("payments").insertOne(payment);

		if (!result?.insertedId) {
			res.status(500).json({ message: "Ошибка записи в базу данных" });
			client.close();
			return;
		}

		res.status(201).json({
			RequestId: result.insertedId.toString(),
			Amount: payment.amount,
		});
	} catch (error) {
		res.status(500).json({ message: "Connected to the database failed" });
	}
}

export default handler;
