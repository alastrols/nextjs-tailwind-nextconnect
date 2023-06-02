import * as Excel from "exceljs";
import { saveAs } from "file-saver";
import axios from "axios";

export default async function saveAsExcel({ rows }: any) {
  const wb = new Excel.Workbook();

  const ws = wb.addWorksheet();
  ws.columns = [{ width: 5 }, { width: 25 }, { width: 20 }, { width: 20 }];
  const row: any = ws.addRow(["No", "Post Date", "Topic", "Status"]);
  row.font = {
    bold: true,
  };
  let content: any;

  await Promise.all(
    rows.map(async (item: any, index: any): Promise<any> => {
      const no = index + 1;
      content = ws.addRow([no, item.post_date, item.topic, item.status]);
      content.height = 20;
    })
  );

  ws.eachRow(function (row, key) {
    row.alignment = { vertical: "middle", horizontal: "center" };
  });
  const buf = await wb.xlsx.writeBuffer();
  await saveAs(new Blob([buf]), "news.xlsx");
}
