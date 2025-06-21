import {getChartJsRaceData} from "@/func/home";
import ChartStandings from "@/comp/home/ChartStandings";

export default async function Standings() {
    const data = await getChartJsRaceData();

    return (
        <div>
            {data && data.datasets?.length > 0 ? (
                <ChartStandings data={data} yAxisMax={100} />
            ) : (
                <div>No data available</div>
            )}

        </div>
    );
}
