export interface QuestionGroup {
  title: string;
  description: string;
  questions: string[];
}

export const sampleQuestionGroups: QuestionGroup[] = [
  {
    title: "Thông tin chương trình học",
    description: "Tìm hiểu về khung chương trình, môn học, điều kiện tốt nghiệp",
    questions: [
      "Chương trình đào tạo ngành của tôi gồm những môn học nào?",
      "Điều kiện để được tốt nghiệp là gì?",
      "Tôi có thể học vượt hay học cải thiện không?",
      "Thời gian tối đa để hoàn thành chương trình học là bao lâu?",
      "Tôi có thể đổi ngành học không?"
    ]
  },
  {
    title: "Quy định và thủ tục",
    description: "Hướng dẫn các thủ tục học vụ, quy định điểm danh, thi cử",
    questions: [
      "Nếu nghỉ học có cần xin phép không?",
      "Quy định về điểm danh trong học kỳ là gì?",
      "Thủ tục đăng ký lại môn học ra sao?",
      "Thi giữa kỳ và cuối kỳ có bắt buộc không?",
      "Tôi nên làm gì khi bị mất thẻ sinh viên?"
    ]
  },
  {
    title: "Học bổng và hỗ trợ",
    description: "Thông tin về học bổng, chế độ hỗ trợ sinh viên",
    questions: [
      "Làm sao để đăng ký học bổng khuyến khích học tập?",
      "Có những loại học bổng nào dành cho sinh viên?",
      "Học bổng có yêu cầu điểm số hay điều kiện gì không?",
      "Tôi có thể nhận hỗ trợ tài chính nếu gặp khó khăn không?",
      "Làm sao để được tư vấn tâm lý miễn phí từ nhà trường?"
    ]
  },
  {
    title: "Hoạt động và sự kiện",
    description: "Cập nhật các hoạt động, sự kiện của chương trình",
    questions: [
      "Làm sao để tham gia các câu lạc bộ sinh viên?",
      "Các sự kiện nổi bật trong năm học là gì?",
      "Sinh viên có bắt buộc tham gia hoạt động ngoại khóa không?",
      "Có hội thảo hoặc workshop nào liên quan đến ngành học không?",
      "Làm thế nào để đăng ký tình nguyện viên cho các sự kiện?"
    ]
  }
];
