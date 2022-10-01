import {NextApiRequest, NextApiResponse} from "next";
import {connect, selectAll} from "../../../lib/Surreal";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const surreal = await connect();
    const devices = await selectAll(surreal);
    res.status(200).json(devices);
}

export default handler;
