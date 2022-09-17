import {NextApiRequest, NextApiResponse} from "next";
import {connect} from "../../../lib/Surreal";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const surreal = await connect();
    surreal.
    res.status(200).json({name: 'John Doe'})
}

export default handler;
