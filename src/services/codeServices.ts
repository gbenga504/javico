import Api from '../utils/ApiConnector';

class CodeService {
  codeRef: any;
  Api: any;

  constructor() {
    this.codeRef = Api.firestore.collection('code');
  }

  persistCode = (payload: any): Promise<any> => {
    const { data } = payload;
    return this.codeRef
      .add({ ...data, timestamp: Api.firestore.FieldValue.serverTimestamp() })
      .then((res: any) => console.log(res))
      .catch((error: any) => {
        console.log('Error persisting document:', error);
      });
  };

  deleteCode = (payload: any): Promise<any> => {
    const { id } = payload;
    return this.codeRef
      .doc(id)
      .delete()
      .then((res: any) => console.log(res))
      .catch((error: any) => {
        console.log('Error deleting document:', error);
      });
  };

  fetchCode = (payload: any): Promise<any> => {
    const { id } = payload;
    return this.codeRef
      .doc(id)
      .get()
      .then((doc: any) => {
        if (doc.exist) {
          console.log(doc);
        } else {
          console.log('Code does not exist');
        }
      })
      .catch((error: any) => {
        console.log('Error fetching document:', error);
      });
  };

  updateCode = (payload: any): Promise<any> => {
    const { data } = payload;
    return this.codeRef
      .doc(data.id)
      .set(data)
      .then((res: any) => console.log(res))
      .catch((error: any) => {
        console.log('Error updating data:', error);
      });
  };
}

const instance = new CodeService();
export default instance;
