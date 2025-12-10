export default interface ISendGridParams {
  to: string;
  template_id: string;
  params?: { [key: string]: any };
}

