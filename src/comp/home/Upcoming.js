import Link from "next/link";
import {getNextRace} from "@/func/home";
import Countdown from "@/comp/home/Countdown";

export default async function Upcoming() {
    const {label, time, raceid} = await getNextRace()

    return (
        <div className="card">
            <h6 className="text-uppercase text-muted mb-1">Next up</h6>
            <h4 className="fw-bold mb-0">{label}</h4>
            <Countdown time={time}/>
            <Link href={'/prediction'} className="text-decoration-none">
                <h5 className="text-dark-subtle mt-4 fw-bold px-4 m-auto">
                    View Prediction
                </h5>
            </Link>
        </div>
    )
}
