package com.ssafy.api.service;

import com.ssafy.db.entity.Files;
import com.ssafy.db.repository.FileRepository;
import com.ssafy.db.repository.FileRepositorySupport;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.ServletContext;
import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.UUID;

@Service
public class FileServiceImpl implements FileService{

    @Autowired
    FileRepository fileRepository;

    @Autowired
    FileRepositorySupport fileRepositorySupport;

    @Autowired
    private ServletContext servletContext;

    @Override
    public void saveFile(MultipartFile[] files, Long tagId, String tag) throws IOException {
        if(files!=null&&!files[0].isEmpty()) {

            // 프로젝트 디렉터리 내의 저장을 위한 절대 경로 설정
            // 경로 구분자 File.separator 사용
//            String realPath = servletContext.getRealPath("/upload");
            String realPath = new File("").getAbsolutePath() + File.separator + "files";  // 두번?
            File fileFolder = new File(realPath);
            if(!fileFolder.exists()) {
                fileFolder.mkdirs();
            }
            System.out.println(realPath);
            String today = new SimpleDateFormat("yyMMdd").format(new Date());
            String saveFolder = realPath + File.separator + today;
            // 파일을 저장할 세부 경로 지정
            File folder = new File(saveFolder);
            System.out.println("폴더: "+folder);
            // 디렉터리가 존재하지 않을 경우
            if(!folder.exists()) {
                folder.mkdirs();
            }

            // 다중 파일 처리
            for(MultipartFile mfile : files) {
                Files newFile=new Files();
                String originalFileName = mfile.getOriginalFilename();
                if (!originalFileName.isEmpty()) {
                    String saveFileName = UUID.randomUUID().toString()
                            + originalFileName.substring(originalFileName.lastIndexOf('.'));
                    newFile.setSaveFolder(today);
                    newFile.setOriginFile(originalFileName);
                    newFile.setSaveFile(saveFileName);
                    newFile.setTag(tag);
                    newFile.setTagId(tagId);

                    System.out.println(("원본 파일 이름 : {"+mfile.getOriginalFilename()+"}, 실제 저장 파일 이름 : {"+saveFileName+"}"));
                    mfile.transferTo(new File(folder, saveFileName));
                }
                fileRepository.save(newFile);

            }
        }
    }

    @Override
    public void updateFile(MultipartFile[] files, Long tagId, String tag) throws IOException {
        fileRepositorySupport.deleteFile(tagId, tag);
        saveFile(files, tagId, tag);
    }

}
