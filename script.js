// Lấy dữ liệu cũ từ máy, nếu không có thì tạo mảng rỗng
let words = JSON.parse(localStorage.getItem('myWords')) || [];
let currentIndex = 0;

// Các phần tử giao diện
const card = document.getElementById('card');
const wordFront = document.getElementById('word-front');
const meaningBack = document.getElementById('meaning-back');

// 1. Logic lật thẻ
if (card) {
    card.addEventListener('click', () => {
        card.classList.toggle('flipped');
    });
}

// 2. Hàm thêm từ (Quan trọng - Kiểm tra ID ở đây)
function addWord() {
    const wordInput = document.getElementById('new-word');
    const meaningInput = document.getElementById('new-meaning');

    const word = wordInput.value.trim();
    const meaning = meaningInput.value.trim();

    if (word === "" || meaning === "") {
        alert("Bạn ơi, nhập cả từ và nghĩa nhé!");
        return;
    }

    // Thêm vào mảng
    words.push({ word, meaning });

    // Lưu vào bộ nhớ máy (LocalStorage)
    localStorage.setItem('myWords', JSON.stringify(words));

    // Reset ô nhập
    wordInput.value = "";
    meaningInput.value = "";
    
    alert(`Đã thêm từ: ${word}`);
    
    // Nếu là từ đầu tiên, hiển thị lên thẻ luôn
    if (words.length === 1) {
        currentIndex = 0;
        updateCard();
    }
}

// 3. Cập nhật nội dung thẻ
function updateCard() {
    if (words.length > 0 && wordFront && meaningBack) {
        card.classList.remove('flipped'); // Úp thẻ lại trước khi đổi từ
        
        // Đợi 1 chút cho thẻ úp xong rồi mới đổi chữ (để không bị lộ nghĩa)
        setTimeout(() => {
            wordFront.innerText = words[currentIndex].word;
            meaningBack.innerText = words[currentIndex].meaning;
        }, 200);
    }
}

// 4. Chuyển từ tiếp theo
function nextCard() {
    if (words.length === 0) {
        alert("Danh sách đang trống, bạn thêm từ trước nhé!");
        return;
    }
    currentIndex = (currentIndex + 1) % words.length;
    updateCard();
}


async function autoTranslate() {
    const wordInput = document.getElementById('new-word');
    const meaningInput = document.getElementById('new-meaning');
    const loadingText = document.getElementById('loading');

    const word = wordInput.value.trim();

    // Nếu ô nhập trống thì không làm gì cả
    if (!word) return;

    // Hiển thị dòng chữ "đang tìm nghĩa"
    loadingText.style.display = 'block';
    meaningInput.placeholder = "Đang kết nối AI...";

    try {
        // Sử dụng MyMemory API (Miễn phí, không cần key)
        const response = await fetch(
            `https://api.mymemory.translated.net/get?q=${encodeURIComponent(word)}&langpair=en|vi`
        );
        
        const data = await response.json();

        if (data.responseData && data.responseData.translatedText) {
            // Điền kết quả vào ô nghĩa
            meaningInput.value = data.responseData.translatedText;
        } else {
            meaningInput.placeholder = "Không tìm thấy nghĩa, hãy tự nhập.";
        }
    } catch (error) {
        console.error("Lỗi API:", error);
        meaningInput.placeholder = "Lỗi kết nối. Vui lòng tự nhập.";
    } finally {
        // Ẩn dòng chữ thông báo sau khi xong
        loadingText.style.display = 'none';
    }
}

function clearCurrentWord() {
    if (words.length === 0) {
        alert("Danh sách trống, không có gì để xóa!");
        return;
    }

    const deletedWord = words[currentIndex].word;

    // Xóa từ khỏi mảng words
    words.splice(currentIndex, 1);

    // Lưu lại mảng mới vào LocalStorage
    localStorage.setItem('myWords', JSON.stringify(words));

    alert(`Đã xóa từ: "${deletedWord}". Giỏi lắm, bạn đã thuộc thêm 1 từ PMP!`);

    // Xử lý vị trí hiển thị sau khi xóa
    if (words.length === 0) {
        // Nếu hết từ, reset giao diện
        wordFront.innerText = "Đã hết từ! Hãy thêm từ mới.";
        meaningBack.innerText = "Trống";
        card.classList.remove('flipped');
    } else {
        // Nếu còn từ, điều chỉnh index để không bị tràn mảng
        if (currentIndex >= words.length) {
            currentIndex = 0;
        }
        updateCard();
    }
}
// Gọi hiển thị lần đầu khi load trang
updateCard();