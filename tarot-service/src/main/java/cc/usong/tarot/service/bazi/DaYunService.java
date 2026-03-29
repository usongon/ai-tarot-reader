package cc.usong.tarot.service.bazi;

import cc.usong.tarot.model.bazi.DaYunInfo;
import com.nlf.calendar.EightChar;
import com.nlf.calendar.eightchar.DaYun;
import com.nlf.calendar.eightchar.Yun;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Period;
import java.util.ArrayList;
import java.util.List;

/**
 * 大运计算服务。
 */
@Service
public class DaYunService {

    /**
     * 计算大运列表。
     */
    public List<DaYunInfo> calculate(EightChar eightChar, String gender, String birthDate) {
        List<DaYunInfo> daYunList = new ArrayList<>();

        int genderValue = "male".equals(gender) ? 1 : 0;
        Yun yun = eightChar.getYun(genderValue);
        DaYun[] daYuns = yun.getDaYun();

        int currentAge = calculateCurrentAge(birthDate);

        for (DaYun daYun : daYuns) {
            if (daYun.getIndex() == 0) {
                continue;
            }

            DaYunInfo info = new DaYunInfo();
            info.setStartAge(daYun.getStartAge());
            info.setEndAge(daYun.getEndAge());

            String ganZhi = daYun.getGanZhi();
            if (ganZhi != null && ganZhi.length() >= 2) {
                info.setTianGan(ganZhi.substring(0, 1));
                info.setDiZhi(ganZhi.substring(1, 2));
                info.setDisplayText(ganZhi);
            }

            info.setCurrent(currentAge >= daYun.getStartAge() && currentAge <= daYun.getEndAge());
            daYunList.add(info);
        }

        return daYunList;
    }

    private int calculateCurrentAge(String birthDate) {
        String[] dateParts = birthDate.split("-");
        LocalDate birthLocalDate = LocalDate.of(
                Integer.parseInt(dateParts[0]),
                Integer.parseInt(dateParts[1]),
                Integer.parseInt(dateParts[2]));
        return Period.between(birthLocalDate, LocalDate.now()).getYears();
    }
}
