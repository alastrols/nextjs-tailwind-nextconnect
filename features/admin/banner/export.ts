import * as Excel from "exceljs";
import { saveAs } from "file-saver";
import axios from "axios";
import moment from "moment";

export default async function saveAsExcel({ rows }: any) {
  const wb = new Excel.Workbook();

  const ws = wb.addWorksheet();
  ws.columns = [
    { width: 5 },
    { width: 25 },
    { width: 20 },
    { width: 30 },
    { width: 20 },
  ];
  const row: any = ws.addRow(["No", "Post Date", "Topic", "Preview", "Status"]);
  row.font = {
    bold: true,
  };
  let content: any;

  await Promise.all(
    rows.map(async (item: any, index: any): Promise<any> => {
      const ext = item.filename.split(".").pop();
      const imageBuffer: any = await axios.get(
        `/upload/banner/${item.filename}`,
        {
          responseType: "arraybuffer",
        }
      );
      const imageId: any = wb.addImage({
        buffer: imageBuffer.data,
        extension: ext,
      });
      const no = index + 1;
      content = ws.addRow([
        no,
        moment(item.post_date).format("YYYY-MM-DD"),
        item.topic,
        "",
        item.status,
      ]);
      content.height = 100;
      ws.addImage(imageId, `D${no + 1}:D${no + 1}`);
    })
  );

  ws.eachRow(function (row, key) {
    row.alignment = { vertical: "middle", horizontal: "center" };
  });
  const buf = await wb.xlsx.writeBuffer();
  await saveAs(new Blob([buf]), "banner.xlsx");
}
