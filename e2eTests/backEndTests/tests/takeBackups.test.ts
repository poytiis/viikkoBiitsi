import axios from "axios";
import { deleteFormDataBackup, deletePools, insertValidPools2, selectAllPools, selectFromFormDataBackup } from "../SQLData/wpzl_postmeta";
import { axiosLogIn, baseUrl, querySingleDatabase } from "../helpers";

describe('Take backups: ', () => {
  it('form data ', async () => {
    const config = await axiosLogIn();

    await querySingleDatabase(deleteFormDataBackup);

    await querySingleDatabase(deletePools);
    await querySingleDatabase(insertValidPools2);

    await axios.get(baseUrl + 'take_backup_form_data.php', config);

    const data = await querySingleDatabase(selectAllPools);
    const backupData = await querySingleDatabase(selectFromFormDataBackup);

    expect(data.length).toBe(backupData.length);
  });
});
